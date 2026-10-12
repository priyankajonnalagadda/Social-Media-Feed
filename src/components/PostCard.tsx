import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import type { PostWithUser } from "../types";

interface PostCardProps {
  post: PostWithUser;
  onToggleLike: (id: number) => void;
  onOpen: (post: PostWithUser) => void;
}

export default function PostCard({ post, onToggleLike, onOpen }: PostCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = post.author.name.split(" ").slice(0, 2).map((part) => part[0]).join("");

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="avatar">{initials}</div>
        <div className="author-block">
          <strong>{post.author.name}</strong>
          <span>@{post.author.username.toLowerCase()}</span>
        </div>
        <button className="icon-button muted" aria-label="More post options" title="More options">
          <MoreHorizontal size={21} />
        </button>
      </header>

      <button className="post-image-button" onClick={() => onOpen(post)} aria-label={`Open post: ${post.title}`}>
        {imageFailed ? (
          <div className="image-fallback"><ImageIcon size={34} /><span>Community moment</span></div>
        ) : (
          <img
            className="post-image"
            src={`https://picsum.photos/seed/social-feed-${post.id}/900/600`}
            alt="Community post"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
      </button>

      <div className="post-content">
        <div className="post-actions">
          <button
            className={`icon-button like-button ${post.liked ? "liked" : ""}`}
            onClick={() => onToggleLike(post.id)}
            aria-label={post.liked ? "Unlike post" : "Like post"}
            title={post.liked ? "Unlike" : "Like"}
          >
            <Heart size={22} fill={post.liked ? "currentColor" : "none"} />
          </button>
          <button className="icon-button" onClick={() => onOpen(post)} aria-label="View post details" title="Comments">
            <MessageCircle size={22} />
          </button>
          <button className="icon-button" onClick={() => onOpen(post)} aria-label="Share post details" title="Share">
            <Send size={21} />
          </button>
          <span className="action-spacer" />
          <button className="icon-button" aria-label="Bookmark post" title="Bookmark">
            <Bookmark size={21} />
          </button>
        </div>
        <div className="like-count">{post.liked ? "You and the community like this" : "Community post"}</div>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <button className="details-link" onClick={() => onOpen(post)}>View post details</button>
      </div>
    </article>
  );
}