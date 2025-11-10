'use client'

import { useState } from "react"
import { User, MoreHorizontal, ThumbsUp, MessageCircle, Flag } from "lucide-react"

// Component for individual comment
const Comment = ({ comment, onReply, onLike, onReport }: any) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [showReplies, setShowReplies] = useState(false)

    const handleReplySubmit = (e: any) => {
        e.preventDefault()
        if (replyText.trim()) {
            onReply(comment.id, replyText)
            setReplyText('')
            setShowReplyForm(false)
            setShowReplies(true)
        }
    }

    return (
        <div className="border-b border-gray-100 last:border-b-0 py-6">
            <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {comment.avatar ? (
                        <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                                {comment.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Comment Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 text-sm">{comment.name}</h4>
                            {comment.verified && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    ✓ Đã xác thực
                                </span>
                            )}
                            <span className="text-gray-500 text-xs">{comment.timeAgo}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Comment Content */}
                    <div className="text-gray-700 text-sm leading-relaxed mb-3">
                        {comment.content}
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => onLike(comment.id)}
                            className={`flex items-center space-x-1 text-xs transition-colors ${comment.liked
                                    ? 'text-blue-600 hover:text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ThumbsUp className={`w-3 h-3 ${comment.liked ? 'fill-current' : ''}`} />
                            <span>{comment.likes > 0 ? comment.likes : 'Thích'}</span>
                        </button>

                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <MessageCircle className="w-3 h-3" />
                            <span>Trả lời</span>
                        </button>

                        <button
                            onClick={() => onReport(comment.id)}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                        >
                            <Flag className="w-3 h-3" />
                            <span>Báo cáo</span>
                        </button>
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="mt-4 ml-0">
                            <div className="flex space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Trả lời ${comment.name}...`}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                        rows={3}
                                    />
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowReplyForm(false)}
                                            className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!replyText.trim()}
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            Trả lời
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium mb-3"
                            >
                                {showReplies ? 'Ẩn' : 'Xem'} {comment.replies.length} phản hồi
                            </button>

                            {showReplies && (
                                <div className="space-y-4 ml-4 border-l-2 border-gray-100 pl-4">
                                    {comment.replies.map((reply: any) => (
                                        <Comment
                                            key={reply.id}
                                            comment={reply}
                                            onReply={onReply}
                                            onLike={onLike}
                                            onReport={onReport}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Main Comments Section Component
const CommentsSection = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            name: "Minh Anh Nguyễn",
            avatar: null,
            verified: true,
            timeAgo: "2 giờ trước",
            content: "Bài viết rất hay và có ích! Mình đã áp dụng một số phương pháp được đề cập và thấy hiệu quả tích cực. Cảm ơn tác giả đã chia sẻ những kinh nghiệm quý báu này.",
            likes: 12,
            liked: false,
            replies: [
                {
                    id: 11,
                    name: "Tác giả",
                    avatar: null,
                    verified: true,
                    timeAgo: "1 giờ trước",
                    content: "Cảm ơn bạn đã đọc và phản hồi tích cực! Rất vui khi biết bài viết có thể giúp ích cho bạn.",
                    likes: 3,
                    liked: false,
                    replies: []
                }
            ]
        },
        {
            id: 2,
            name: "Hoàng Đức Thành",
            avatar: null,
            verified: false,
            timeAgo: "4 giờ trước",
            content: "Quan điểm của bài viết khá thú vị, tuy nhiên mình nghĩ còn thiếu một số case study cụ thể để minh họa. Có thể tác giả sẽ bổ sung thêm trong các bài viết tiếp theo?",
            likes: 8,
            liked: true,
            replies: []
        },
        {
            id: 3,
            name: "Thu Hương",
            avatar: null,
            verified: false,
            timeAgo: "6 giờ trước",
            content: "Mình đã bookmark bài viết này để đọc lại. Nội dung rất chi tiết và dễ hiểu. Đặc biệt phần phân tích về xu hướng thị trường rất có giá trị tham khảo.",
            likes: 5,
            liked: false,
            replies: []
        }
    ])

    const [commentForm, setCommentForm] = useState({
        name: '',
        email: '',
        content: ''
    })

    const [sortBy, setSortBy] = useState('newest') // newest, oldest, most_liked

    const handleCommentSubmit = (e: any) => {
        e.preventDefault()
        if (commentForm.name && commentForm.email && commentForm.content) {
            const newComment = {
                id: Date.now(),
                name: commentForm.name,
                avatar: null,
                verified: false,
                timeAgo: "Vừa xong",
                content: commentForm.content,
                likes: 0,
                liked: false,
                replies: []
            }
            setComments([newComment, ...comments])
            setCommentForm({ name: '', email: '', content: '' })

            // Show success message
            alert('Bình luận đã được gửi thành công!')
        }
    }

    const handleReply = (commentId: any, replyText: any) => {
        const newReply = {
            id: Date.now(),
            name: "Bạn", // In real app, this would be current user's name
            avatar: null,
            verified: false,
            timeAgo: "Vừa xong",
            content: replyText,
            likes: 0,
            liked: false,
            replies: []
        }

        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                }
            }
            return comment
        }))
    }

    const handleLike = (commentId: any) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    liked: !comment.liked,
                    likes: comment.liked ? comment.likes - 1 : comment.likes + 1
                }
            }
            // Handle nested replies
            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply => {
                        if (reply.id === commentId) {
                            return {
                                ...reply,
                                liked: !reply.liked,
                                likes: reply.liked ? reply.likes - 1 : reply.likes + 1
                            }
                        }
                        return reply
                    })
                }
            }
            return comment
        }))
    }

    const handleReport = (commentId: any) => {
        alert('Báo cáo đã được gửi. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.')
    }

    const sortedComments = [...comments].sort((a, b) => {
        switch (sortBy) {
            case 'oldest':
                return a.id - b.id
            case 'most_liked':
                return b.likes - a.likes
            default: // newest
                return b.id - a.id
        }
    })

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            {/* Comment Form */}
            <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Để lại bình luận</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={commentForm.name}
                                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Nhập họ tên của bạn"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={commentForm.email}
                                onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="example@email.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung bình luận <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={commentForm.content}
                            onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                            rows={4}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-colors"
                            placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Bình luận của bạn sẽ được hiển thị sau khi được duyệt.
                        </p>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Gửi bình luận
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments Display */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        Bình luận ({comments.length})
                    </h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sắp xếp:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="most_liked">Nhiều like nhất</option>
                        </select>
                    </div>
                </div>

                {sortedComments.length > 0 ? (
                    <div className="space-y-0">
                        {sortedComments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                onReply={handleReply}
                                onLike={handleLike}
                                onReport={handleReport}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentsSection 