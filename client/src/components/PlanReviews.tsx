import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send,
  User,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  id: number;
  user_id: number;
  plan_id: number;
  rating: number;
  title: string;
  content: string;
  helpful_votes: number;
  unhelpful_votes: number;
  created_at: string;
  user: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

interface PlanReviewsProps {
  planId: number;
  planTitle: string;
}

const PlanReviews = ({ planId, planTitle }: PlanReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [planId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${planId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to fetch reviews:', response.status);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          user_id: user.id,
          rating: newReview.rating,
          title: newReview.title,
          content: newReview.content
        })
      });

      if (response.ok) {
        const review = await response.json();
        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, title: '', content: '' });
        setShowReviewForm(false);
        alert('Review submitted successfully!');
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = (reviewId: number, isHelpful: boolean) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpful_votes: isHelpful ? review.helpful_votes + 1 : review.helpful_votes,
          unhelpful_votes: !isHelpful ? review.unhelpful_votes + 1 : review.unhelpful_votes
        };
      }
      return review;
    }));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">Customer Reviews</h3>
          <p className="text-slate-600">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} for {planTitle}
          </p>
        </div>
        <Button 
          onClick={() => setShowReviewForm(true)}
          disabled={!user}
          className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="p-6 rounded-3xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= averageRating 
                        ? 'text-orange-500 fill-current' 
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-600">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-slate-600">{rating}</span>
                    <Star className="w-4 h-4 text-orange-500 fill-current" />
                  </div>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="p-6 rounded-3xl border border-slate-200 bg-white">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-slate-900 mb-2">Write Your Review</h4>
            <p className="text-slate-600">
              Share your experience with this house plan
            </p>
          </div>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating Selection */}
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= newReview.rating 
                            ? 'text-orange-500 fill-current' 
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-2">
                <Label htmlFor="review-title">Review Title</Label>
                <Input
                  id="review-title"
                  placeholder="Summarize your experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  required
                />
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <Label htmlFor="review-content">Review Content</Label>
                <Textarea
                  id="review-content"
                  placeholder="Share your detailed experience with this house plan..."
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-slate-200 bg-white">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">No Reviews Yet</h4>
            <p className="text-slate-600 mb-4">
              Be the first to share your experience with this house plan
            </p>
            <Button 
              onClick={() => setShowReviewForm(true)}
              disabled={!user}
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
            >
              Write the First Review
            </Button>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-6 rounded-3xl border border-slate-200 bg-white">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.user.avatar_url} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{review.user.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating 
                                    ? 'text-orange-500 fill-current' 
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(review.id, true)}
                          className="h-8 px-2"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {review.helpful_votes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(review.id, false)}
                          className="h-8 px-2"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          {review.unhelpful_votes}
                        </Button>
                      </div>
                    </div>
                    
                    <h5 className="font-medium text-slate-900 mb-2">{review.title}</h5>
                    <p className="text-slate-600 leading-relaxed">{review.content}</p>
                  </div>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlanReviews;
