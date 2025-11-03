import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf'; // 1. Import jsPDF

function MyDonations() {
  const { currentUser } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return; 

    const q = query(
      collection(db, "donations"),
      where("donorId", "==", currentUser.uid),
      orderBy("confirmedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userDonations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(userDonations);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching donations: ", error);
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 2. Add the PDF generation function
  const handleDownloadCertificate = (donation) => {
    const doc = new jsPDF();
    
    // Get donor name from context
    const donorName = currentUser.name || currentUser.username;
    const hospitalName = donation.hospitalName;
    const donationDate = donation.confirmedAt.toDate().toLocaleDateString();

    // Set properties
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(220, 53, 69); // Red color for "BloodLink"
    doc.text("BloodLink Certificate of Appreciation", 105, 30, { align: 'center' });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("This certificate is presented to", 105, 60, { align: 'center' });
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(donorName, 105, 75, { align: 'center' });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("For their selfless contribution of blood", 105, 90, { align: 'center' });
    doc.text(`Confirmed on ${donationDate}`, 105, 100, { align: 'center' });
    doc.text(`at ${hospitalName}`, 105, 110, { align: 'center' });

    doc.setFontSize(14);
    doc.text("Your donation is a precious gift of life.", 105, 140, { align: 'center' });

    doc.setFont("Helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text("Note: This is a non-verifiable certificate for appreciation purposes only.", 105, 160, { align: 'center' });

    // Save the PDF
    doc.save(`BloodLink_Certificate_${donation.id.substring(0, 5)}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        My Donation History
      </h1>

      {(() => {
        if (loading) {
          return <p className="text-center text-gray-500">Loading your donation history...</p>;
        }
        if (donations.length === 0) {
          return <p className="text-center text-gray-500">You have no confirmed donations yet.</p>;
        }
        return (
          <div className="space-y-6">
            {donations.map(donation => {
            const formattedDate = donation.confirmedAt?.toDate
              ? donation.confirmedAt.toDate().toLocaleDateString()
              : 'N/A';
            
            return (
              <div key={donation.id} className="bg-white shadow-md rounded-xl p-6 border border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-primary-600">
                    Donation Confirmed
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <strong>Confirmed by:</strong> {donation.hospitalName}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    On: {formattedDate}
                  </p>
                </div>
                <div>
                  {/* 3. Update the button to call the new function */}
                  <button 
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
                    onClick={() => handleDownloadCertificate(donation)}
                  >
                    Download Certificate
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        );
      })()}
    </div>
  );
}

export default MyDonations;