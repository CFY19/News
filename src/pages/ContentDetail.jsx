import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailHeader from '../components/Detail/DetailHeader';
import DetailContent from '../components/Detail/DetailContent';
import { feedItems } from '../data';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = feedItems.find(i => i.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Content not found</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-md mx-auto shadow-sm bg-white min-h-screen">
        <DetailHeader />
        <DetailContent item={item} />
      </div>
    </div>
  );
};

export default ContentDetail;
