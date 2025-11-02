import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function WritePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in both the title and content.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "blogPosts"), {
        title: title,
        content: content,
        authorName: currentUser.username || currentUser.email,
        authorId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert(' Blog post published successfully!');
      navigate('/blog');
    } catch (error) {
      console.error(" Error publishing post:", error);
      alert('Failed to publish post. Please check console and security rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Write a New Blog Post
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2 text-lg">
            Post Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A catchy title for your post"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2 text-lg">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="15"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here. You can use Markdown, but it will be rendered as plain text for now."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          ></textarea>
        </div>

        <div className="text-right pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-md transition duration-200 ${
              loading ? 'bg-gray-400' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WritePost;