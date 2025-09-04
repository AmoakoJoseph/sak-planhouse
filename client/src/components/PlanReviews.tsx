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
      // Mock data for now - replace with actual API call
      const mockReviews: Review[] = [
        {
          id: 1,
          user_id: 1,
          plan_id: planId,
          rating: 5,
          title: 'Excellent Design and Quality',
          content: 'This plan exceeded my expectations. The layout is perfect for our family, and the attention to detail is remarkable. The construction process was smooth thanks to the comprehensive documentation.',
          helpful_votes: 12,
          unhelpful_votes: 1,
          created_at: '2024-01-15T10:30:00Z',
          user: {
            name: 'Kwame Asante',
            email: 'kwame@example.com',
            avatar_url: '/placeholder.svg'
          }
        },
        {
          id: 2,
          user_id: 2,
          plan_id: planId,
          rating: 4,
          title: 'Great Value for Money',
          content: 'Very satisfied with this purchase. The plans are detailed and easy to follow. Our contractor had no issues understanding the specifications. Would recommend to others.',
          helpful_votes: 8,
          unhelpful_votes: 0,
          created_at: '2024-01-10T14:20:00Z',
          user: {
            name: 'Ama Osei',
            email: 'ama@example.com',
            avatar_url: '/placeholder.svg'
          }
        },
        {
          id: 3,
          user_id: 3,
          plan_id: planId,
          rating: 5,
          title: 'Perfect for Our Needs',
          content: 'We love everything about this plan. The bedrooms are well-proportioned, the kitchen layout is functional, and the overall flow is excellent. Highly recommended!',
          helpful_votes: 15,
          unhelpful_votes: 0,
          created_at: '2024-01-05T09:15:00Z',
          user: {
            name: 'Kofi Mensah',
            email: 'kofi@example.com',
            avatar_url: '/placeholder.svg'
          }
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
      // Mock submission - replace with actual API call
      const review: Review = {
        id: Date.now(),
        user_id: user.id,
        plan_id: planId,
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
        helpful_votes: 0,
        unhelpful_votes: 0,
        created_at: new Date().toISOString(),
        user: {
          name: user.name || user.email,
          email: user.email,
          avatar_url: user.avatar_url
        }
      };

      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, title: '', content: '' });
      setShowReviewForm(false);
      
      // Show success message
      alert('Review submitted successfully!');
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
          <h3 className="text-2xl font-bold text-foreground">Customer Reviews</h3>
          <p className="text-muted-foreground">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} for {planTitle}
          </p>
        </div>
        <Button 
          onClick={() => setShowReviewForm(true)}
          disabled={!user}
          className="btn-primary"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= averageRating 
                        ? 'text-warning fill-current' 
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-muted-foreground">{rating}</span>
                    <Star className="w-4 h-4 text-warning fill-current" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
            <CardDescription>
              Share your experience with this house plan
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                            ? 'text-warning fill-current' 
                            : 'text-muted-foreground'
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
                  className="btn-primary"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h4 className="text-lg font-semibold text-foreground mb-2">No Reviews Yet</h4>
              <p className="text-muted-foreground mb-4">
                Be the first to share your experience with this house plan
              </p>
              <Button 
                onClick={() => setShowReviewForm(true)}
                disabled={!user}
                className="btn-primary"
              >
                Write the First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
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
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating 
                                    ? 'text-warning fill-current' 
                                    : 'text-muted-foreground'
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
                    
                    <h5 className="font-medium text-foreground mb-2">{review.title}</h5>
                    <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PlanReviews;
