import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaStar, FaThumbsUp, FaReply, FaPencilAlt } from 'react-icons/fa';
import { VideoLesson, ExerciseLesson, VocabularyLesson, GrammarLesson, DialogueLesson } from '@/components/lessons';
import '@/styles/lesson/LessonDetail.css';

interface Props {
  lessonId: number;
  onBack: () => void;
}

// Lesson data structure from API
interface LessonContent {
  vocabulary?: Array<{
    word: string;
    meaning: string;
    example: string;
  }>;
  grammar?: {
    topic?: string;
    explanation?: string;
    examples?: string[];
  };
  dialogue?: Array<{
    speaker: string;
    text: string;
  }>;
  video?: {
    url?: string;
    description?: string;
    duration?: number;
  };
  quiz?: Array<{
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  }>;
  exercise?: {
    type: string;
    instruction?: string;
    questions?: Array<{
      sentence: string;
      answer: string;
    }>;
  };
}

interface LessonData {
  id: number;
  title: string;
  type: 'video' | 'exercise' | 'quiz';
  orderIndex: number;
  duration: number;
  completed: boolean;
  exercises: any[];
  content: string; // JSON string from API
  parsedContent?: LessonContent; // Parsed content object
}

// Comment interface from API
interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  rating: number;
  date: string;
  content: string;
  likes: number;
  liked: boolean;
  replies: Comment[];
}

// Function to format timestamp to relative time
const getRelativeTime = (timestamp: string): string => {
  const now = new Date().getTime();
  const commentTime = new Date(timestamp).getTime();
  const diff = now - commentTime;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} năm trước`;
  } else if (months > 0) {
    return `${months} tháng trước`;
  } else if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return `${seconds} giây trước`;
  }
};

const BeginnerLessonDetail: React.FC<Props> = ({ lessonId, onBack }) => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [completed, setCompleted] = useState<boolean>(false);

  const STORAGE_KEY = `enghub.beginner.lesson${lessonId}.completed`;

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/comments/lesson/${lessonId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [lessonId]);

  // Fetch lesson data from API
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/v1/lessons/${lessonId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch lesson');
        }
        
        const responseData = await response.json();
        const data = responseData.result;

        console.log('Fetched lesson data:', data);
        // Parse content JSON
        if (data.content) {
          data.parsedContent = JSON.parse(data.content);
        }
        
        setLesson(data);
        
        // Load completion status
        const saved = localStorage.getItem(STORAGE_KEY);
        setCompleted(saved === 'true');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, STORAGE_KEY]);

  const hasData = (data: any): boolean => {
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return true;
  };

  if (loading) {
    return (
      <div className="beginner-lesson-detail">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <div className="video-lesson-spinner" />
          <p style={{ marginLeft: '16px' }}>Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="beginner-lesson-error">
        <button onClick={onBack} className="back-btn">
          <FaArrowLeft /> <span>Quay lại khóa Beginner</span>
        </button>
        <h1 className="title">Không thể tải bài học</h1>
        <p>{error || 'Bài học không tồn tại'}</p>
      </div>
    );
  }

  const renderLessonContent = () => {
    const content = lesson?.parsedContent || {};
    
    // Prepare quiz questions if available
    const questions = hasData(content.quiz) 
      ? content.quiz!.map((q, idx) => ({
          id: idx,
          question: q.question,
          type: 'multiple-choice' as const,
          options: q.options,
          correctAnswer: q.answer,
          explanation: q.explanation || '',
        }))
      : [];

    return (
      <div className="beginner-lesson-detail">
        {/* Back Button */}
        <div className="lesson-header">
          <button onClick={onBack} className="back-btn">
            <FaArrowLeft /> <span>Quay lại khóa Beginner</span>
          </button>
          <h1 className="lesson-title">{lesson.title}</h1>
        </div>

        {/* Video Section */}
        {hasData(content.video) && content.video!.url && (
          <VideoLesson
            lesson={{
              id: lessonId,
              title: lesson.title,
              videoUrl: content.video!.url,
              description: content.video!.description || '',
              duration: `${lesson.duration} phút`,
              completed: completed,
            }}
            courseTitle="Khóa học Beginner"
            onBack={onBack}
            hideHeader={true}
            onComplete={() => {
              setCompleted(true);
              localStorage.setItem(STORAGE_KEY, 'true');
            }}
          />
        )}

        {/* Vocabulary Section */}
        {hasData(content.vocabulary) && (
          <VocabularyLesson
            title="Từ vựng"
            description={`Học ${content.vocabulary!.length} từ vựng quan trọng trong bài này`}
            vocabulary={content.vocabulary!}
            onComplete={() => {
              console.log('Completed vocabulary section');
            }}
          />
        )}

        {/* Grammar Section */}
        {hasData(content.grammar) && (
          <GrammarLesson
            title="Ngữ pháp"
            description="Tìm hiểu và nắm vững điểm ngữ pháp quan trọng"
            grammar={content.grammar!}
            onComplete={() => {
              console.log('Completed grammar section');
            }}
          />
        )}

        {/* Dialogue Section */}
        {hasData(content.dialogue) && (
          <DialogueLesson
            title="Hội thoại"
            description="Luyện tập giao tiếp qua các đoạn hội thoại thực tế"
            dialogue={content.dialogue!}
            onComplete={() => {
              console.log('Completed dialogue section');
            }}
          />
        )}

        {/* Quiz Section */}
        {hasData(questions) && (
          <ExerciseLesson
            title="Bài kiểm tra"
            description="Hoàn thành các câu hỏi dưới đây để kiểm tra hiểu biết"
            instructions="Chọn đáp án đúng cho mỗi câu hỏi"
            questions={questions}
            passingScore={80}
            onComplete={async (score, passed) => {
              if (passed) {
                setCompleted(true);
                localStorage.setItem(STORAGE_KEY, 'true');
                
                // Call API to save score
                try {
                  const token = localStorage.getItem('authToken');
                  await fetch(`http://localhost:8080/api/v1/lessons/${lessonId}/complete`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      score: score,
                    }),
                  });
                } catch (error) {
                  console.error('Error saving lesson completion:', error);
                }
              }
            }}
          />
        )}

        {/* Fill-in-blank Exercise Section */}
        {hasData(content.exercise) && hasData(content.exercise!.questions) && (
          <section className="lesson-section exercise-section">
            <div className="section-header">
              <FaPencilAlt className="section-icon" />
              <h2>Bài tập điền từ</h2>
            </div>
            <div className="exercise-content">
              {content.exercise!.instruction && (
                <p className="exercise-instruction">{content.exercise!.instruction}</p>
              )}
              <div className="exercise-questions">
                {content.exercise!.questions!.map((item, index) => (
                  <div key={index} className="exercise-question">
                    <p><strong>{index + 1}.</strong> {item.sentence}</p>
                    <p className="exercise-answer"><em>Đáp án: {item.answer}</em></p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  };

  const handleLikeComment = async (commentId: number, isReply: boolean = false, parentId?: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const comment = comments.find(c => c.id === commentId || c.replies?.some(r => r.id === commentId));
      const targetComment = isReply 
        ? comment?.replies?.find(r => r.id === commentId)
        : comment;
      
      const isLiked = targetComment?.liked;
      
      if (isLiked) {
        // Unlike
        await fetch(`http://localhost:8080/api/comments/${commentId}/like`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Like
        await fetch(`http://localhost:8080/api/comments/${commentId}/like`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Update local state
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (!isReply && comment.id === commentId) {
            return {
              ...comment,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
              liked: !comment.liked
            };
          }
          if (isReply && comment.id === parentId && comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                    liked: !reply.liked
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        });
      });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lessonId,
          parentId: null,
          rating: newRating,
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newCommentData = await response.json();

      // Add new comment to the list
      setComments([newCommentData, ...comments]);
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Không thể thêm nhận xét. Vui lòng thử lại.');
    }
  };

  const handleAddReply = async (parentId: number) => {
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lessonId,
          parentId: parentId,
          rating: 0,
          content: replyText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const newReply = await response.json();

      // Add reply to parent comment
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          return comment;
        });
      });
      
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Không thể thêm câu trả lời. Vui lòng thử lại.');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="stars-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={interactive ? 20 : 16}
            color={star <= rating ? "#fbbf24" : "#e5e7eb"}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const renderComment = (comment: Comment, isReply: boolean = false, parentId?: number) => (
    <div key={comment.id} className={`comment-item ${isReply ? 'reply' : ''}`}>
      <div className="comment-avatar">
        <div className="avatar-placeholder">{comment.authorName.charAt(0).toUpperCase()}</div>
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <h4 className="comment-author">{comment.authorName}</h4>
          {comment.rating > 0 && renderStars(comment.rating)}
          <span className="comment-date">{getRelativeTime(comment.date)}</span>
        </div>
        <p className="comment-text">{comment.content}</p>
        <div className="comment-actions">
          <button 
            className={`like-btn ${comment.liked ? 'liked' : ''}`}
            onClick={() => handleLikeComment(comment.id, isReply, parentId)}
          >
            <FaThumbsUp size={14} />
            <span>{comment.likes}</span>
          </button>
          {!isReply && (
            <button 
              className="reply-btn"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <FaReply size={14} />
              <span>Trả lời</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Viết câu trả lời..."
              rows={3}
            />
            <div className="reply-form-actions">
              <button onClick={() => setReplyingTo(null)} className="cancel-btn">
                Hủy
              </button>
              <button onClick={() => handleAddReply(comment.id)} className="submit-btn">
                Gửi
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="beginner-lesson-detail">
      {renderLessonContent()}
      
      {/* Comments Section */}
      <section className="lesson-comments-section">
        <div className="comments-container">
          <h2 className="comments-title">Nhận xét của học viên ({comments.length})</h2>
          
          {/* Add Comment Form */}
          <div className="add-comment-form">
            <h3>Để lại nhận xét của bạn</h3>
            <div className="rating-input">
              <label>Đánh giá:</label>
              {renderStars(newRating, true, setNewRating)}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về bài học này..."
              rows={4}
            />
            <button onClick={handleAddComment} className="submit-comment-btn">
              Gửi nhận xét
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {commentsLoading ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Đang tải nhận xét...</p>
            ) : comments.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Chưa có nhận xét nào</p>
            ) : (
              comments.map(comment => renderComment(comment))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BeginnerLessonDetail;
