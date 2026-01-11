import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaStar, FaThumbsUp, FaReply, FaPencilAlt } from 'react-icons/fa';
import { VideoLesson, ExerciseLesson, VocabularyLesson, GrammarLesson, DialogueLesson } from '@/components/lessons';
import { useStudyEvents } from '@/hooks';
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
    imageUrl?: string;
  }>;
  grammar?: {
    topic: string;
    explanation: string;
    signalWord: string;
    formulas: Array<{
      type: string;
      formula: string;
      verbType: 'REGULAR_VERB' | 'TO_BE';
      examples: Array<{
        sentence: string;
        translation: string;
        highlight: string;
      }>;
    }>;
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
  type?: 'video' | 'exercise' | 'quiz';
  orderIndex: number;
  duration: number;
  completed: boolean;
  unitId?: number; // Unit ID from API
  exercises?: any[];
  dialogues?: any[];
  vocabularies?: any[];
  grammar?: any;
  video?: any;
  studySkill?: string;
  content?: string; // JSON string from API (optional)
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
  const [showExercises, setShowExercises] = useState<boolean>(false);

  const STORAGE_KEY = `enghub.beginner.lesson${lessonId}.completed`;

  useStudyEvents({
    lessonId,
    activityType: 'LESSON',
    skill: (lesson?.studySkill as any) || 'VOCAB', 
    autoStart: true,  
    autoEnd: true,    
    onStatsUpdate: () => {
    },
  });

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

        // Parse exercises into quiz questions and fill-blank exercises
        const quizQuestions: any[] = [];
        const fillBlankQuestions: any[] = [];

        if (data.exercises && data.exercises.length > 0) {
          data.exercises.forEach((ex: any) => {
            const metadata = typeof ex.metadata === 'string' ? JSON.parse(ex.metadata) : ex.metadata;

            switch (ex.type) {
              case 'MULTIPLE_CHOICE':
                quizQuestions.push({
                  question: ex.question,
                  options: metadata.options || [],
                  answer: metadata.correct || '',
                  explanation: metadata.explanation || '',
                });
                break;

              case 'FILL_BLANK':
                fillBlankQuestions.push({
                  sentence: ex.question,
                  answer: metadata.answer || ''
                });
                break;

              case 'TRANSLATE':
                quizQuestions.push({
                  question: ex.question,
                  options: [], // Will be handled as text input
                  answer: metadata.answer || '',
                  explanation: metadata.explanation || '',
                });
                break;

              case 'MATCH_PAIRS':
              case 'SELECT_IMAGE':
                // These types can be added later if needed
                console.log(`Exercise type ${ex.type} not yet supported`);
                break;

              default:
                console.log(`Unknown exercise type: ${ex.type}`);
            }
          });
        }

        data.parsedContent = {
          vocabulary: data.vocabularies || [],
          grammar: data.grammar || null,
          dialogue: data.dialogues || [],
          video: data.video || null,
          quiz: quizQuestions,
          exercise: fillBlankQuestions.length > 0 ? {
            type: 'fill-blank',
            instruction: 'Điền vào chỗ trống',
            questions: fillBlankQuestions
          } : null
        };
        
        setLesson(data);
        
        // Auto-show exercises for lessons with ID >= 21
        if (lessonId >= 21) {
          console.log('Auto-showing exercises for lesson ID', lessonId);
          setShowExercises(true);
        }
        
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
      <div className="beginner-lesson-error-lesson-detail">
        <button onClick={onBack} className="back-btn-lesson-detail">
          <FaArrowLeft /> <span>Quay lại khóa Beginner</span>
        </button>
        <h1 className="title-lesson-detail">Không thể tải bài học</h1>
        <p>{error || 'Bài học không tồn tại'}</p>
      </div>
    );
  }

  const handleStartExercises = () => {
    setShowExercises(true);
    window.scrollTo(0, 0);
  };

  const handleBackToLesson = () => {
    // For lessons with ID >= 21, go back to course page
    if (lessonId >= 21) {
      onBack();
    } else {
      setShowExercises(false);
      window.scrollTo(0, 0);
    }
  };

  const renderExercisesPage = () => {
    // Prepare exercises from lesson data
    const exercisesFromAPI: any[] = [];
    
    if (lesson?.exercises && lesson.exercises.length > 0) {
      lesson.exercises.forEach((ex: any) => {
        const metadata = typeof ex.metadata === 'string' ? JSON.parse(ex.metadata) : ex.metadata;
        exercisesFromAPI.push({
          question: ex.question,
          type: ex.type,
          metadata: metadata
        });
      });
    }

    const hasExercises = exercisesFromAPI.length > 0;

    if (!hasExercises) {
      return (
        <div className="beginner-lesson-detail">
          <div className="lesson-header-lesson-detail">
            <button onClick={handleBackToLesson} className="back-btn-lesson-detail">
              <FaArrowLeft /> <span>{lessonId >= 21 ? 'Quay lại khóa học' : 'Quay lại bài học'}</span>
            </button>
            <h1 className="lesson-title-lesson-detail">Bài tập - {lesson.title}</h1>
          </div>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>Bài học này chưa có bài tập</p>
            <button onClick={handleBackToLesson} className="primary-btn-lesson-detail" style={{ marginTop: '1rem' }}>
              {lessonId >= 21 ? 'Quay lại khóa học' : 'Quay lại bài học'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="beginner-lesson-detail">
        {/* Back Button */}
        <div className="lesson-header-lesson-detail">
          <button onClick={handleBackToLesson} className="back-btn-lesson-detail">
            <FaArrowLeft /> <span>{lessonId >= 21 ? 'Quay lại khóa học' : 'Quay lại bài học'}</span>
          </button>
          <h1 className="lesson-title-lesson-detail">Bài tập - {lesson.title}</h1>
        </div>

        {/* Exercise Section */}
        {hasExercises && (
          <ExerciseLesson
            title="Bài tập thực hành"
            description="Hoàn thành các câu hỏi dưới đây để kiểm tra kiến thức của bạn"
            instructions="Làm đầy đủ tất cả các câu hỏi"
            exercises={exercisesFromAPI}
            passingScore={70}
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
                
                setTimeout(() => {
                  onBack();
                  window.location.reload();
                }, 1500);
              }
            }}
          />
        )}

        {/* Back button at bottom */}
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <button onClick={handleBackToLesson} className="back-btn-lesson-detail">
            <FaArrowLeft /> Quay lại bài học
          </button>
        </div>
      </div>
    );
  };

  const renderLessonContent = () => {
    const content = lesson?.parsedContent || {};
    
    const hasLearningContent = hasData(content.video) || hasData(content.vocabulary) || 
                               hasData(content.grammar) || hasData(content.dialogue);

    return (
      <div className="beginner-lesson-detail">
        {/* Back Button */}
        <div className="lesson-header-lesson-detail">
          <button onClick={onBack} className="back-btn-lesson-detail">
            <FaArrowLeft /> <span>Quay lại khóa Beginner</span>
          </button>
          <h1 className="lesson-title-lesson-detail">{lesson.title}</h1>
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
              parsedContent: content, // Truyền parsedContent để VideoLesson có thể lấy video.id
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

        {/* Button to start exercises */}
        {hasLearningContent && (
          <div className="lesson-completion-section-lesson-detail">
            <div className="completion-card-lesson-detail">
              <h3>Hoàn thành phần học!</h3>
              <p>Bạn đã hoàn thành tất cả nội dung bài học. Hãy làm bài tập để kiểm tra kiến thức của mình!</p>
              <button 
                onClick={handleStartExercises}
                className="start-exercises-btn-lesson-detail"
              >
                <FaPencilAlt style={{ marginRight: '8px' }} />
                Làm bài tập ngay
              </button>
            </div>
          </div>
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
      <div className="stars-rating-lesson-detail">
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
    <div key={comment.id} className={`comment-item-lesson-detail ${isReply ? 'reply-lesson-detail' : ''}`}>
      <div className="comment-avatar-lesson-detail">
        <div className="avatar-placeholder-lesson-detail">{comment.authorName.charAt(0).toUpperCase()}</div>
      </div>
      <div className="comment-content-lesson-detail">
        <div className="comment-header-lesson-detail">
          <h4 className="comment-author-lesson-detail">{comment.authorName}</h4>
          {comment.rating > 0 && renderStars(comment.rating)}
          <span className="comment-date-lesson-detail">{getRelativeTime(comment.date)}</span>
        </div>
        <p className="comment-text-lesson-detail">{comment.content}</p>
        <div className="comment-actions-lesson-detail">
          <button 
            className={`like-btn-lesson-detail ${comment.liked ? 'liked-lesson-detail' : ''}`}
            onClick={() => handleLikeComment(comment.id, isReply, parentId)}
          >
            <FaThumbsUp size={14} />
            <span>{comment.likes}</span>
          </button>
          {!isReply && (
            <button 
              className="reply-btn-lesson-detail"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <FaReply size={14} />
              <span>Trả lời</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="reply-form-lesson-detail">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Viết câu trả lời..."
              rows={3}
            />
            <div className="reply-form-actions-lesson-detail">
              <button onClick={() => setReplyingTo(null)} className="cancel-btn-lesson-detail">
                Hủy
              </button>
              <button onClick={() => handleAddReply(comment.id)} className="submit-btn-lesson-detail">
                Gửi
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies-lesson-detail">
            {comment.replies.map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    </div>
  );

  // Show exercises page if user clicked "Làm bài tập"
  if (showExercises) {
    return renderExercisesPage();
  }

  return (
    <div className="beginner-lesson-detail">
      {renderLessonContent()}
      
      {/* Comments Section */}
      <section className="lesson-comments-section-lesson-detail">
        <div className="comments-container-lesson-detail">
          <h2 className="comments-title-lesson-detail">Nhận xét của học viên ({comments.length})</h2>
          
          {/* Add Comment Form */}
          <div className="add-comment-form-lesson-detail">
            <h3>Để lại nhận xét của bạn</h3>
            <div className="rating-input-lesson-detail">
              <label>Đánh giá:</label>
              {renderStars(newRating, true, setNewRating)}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về bài học này..."
              rows={4}
            />
            <button onClick={handleAddComment} className="submit-comment-btn-lesson-detail">
              Gửi nhận xét
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list-lesson-detail">
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
