import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DetailHeader from '../components/Detail/DetailHeader';
import DetailContent from '../components/Detail/DetailContent';
import { getHistory } from '../services/storageService';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Robust Item Retrieval: Try state -> Try history -> Try fetching (optional)
  const item = useMemo(() => {
    if (location.state?.item) return location.state.item;

    // If state is missing (refresh), find in local history
    const history = getHistory();
    return history.find(a => a.id === id);
  }, [id, location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Content not found</h1>
        <p className="text-soft-gray mb-8">Please go back to the feed to select a story.</p>
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
        <DetailHeader item={item} />
        <DetailContent item={item} />
      </div>
    </div>
  );
};

export default ContentDetail;
