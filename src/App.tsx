import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell, Compass, Heart, Home, LoaderCircle, LogIn, MessageCircle,
  Plus, Search, Settings, Users, X, RefreshCw, Sparkles,
} from "lucide-react";
import { fetchFeed } from "./api";
import PostCard from "./components/PostCard";
import type { FeedPost, FeedUser, PostWithUser } from "./types";

type FeedFilter = "all" | "liked";

export default function App() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [selectedPost, setSelectedPost] = useState<PostWithUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFeed();
      const usersById = new Map<number, FeedUser>(data.users.map((user) => [user.id, user]));
      setPosts((current) => {
        const likedIds = new Set(current.filter((post) => post.liked).map((post) => post.id));
        return data.posts.map((post: FeedPost) => ({
          ...post,
          author: usersById.get(post.userId) ?? {
            id: post.userId, name: "Community Member", username: "member", email: "",
          },
          liked: likedIds.has(post.id),
        }));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while loading the feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const visiblePosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesFilter = filter === "all" || post.liked;
      const matchesSearch = !term || `${post.title} ${post.body} ${post.author.name}`.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [posts, search, filter]);

  function toggleLike(id: number) {
    setPosts((current) => current.map((post) => post.id === id ? { ...post, liked: !post.liked } : post));
    setSelectedPost((current) => current && current.id === id ? { ...current, liked: !current.liked } : current);
  }

  const likedCount = posts.filter((post) => post.liked).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Loop home">
          <span className="brand-mark"><Sparkles size={19} /></span><span>loop<span className="brand-dot">.</span></span>
        </a>
        <div className="profile-mini">
          <div className="profile-avatar">P</div>
          <div><strong>Your space</strong><span>Personal feed</span></div>
          <span className="online-dot" />
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={`nav-item ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}><Home size={19} /> Home <span className="nav-count">•</span></button>
          <button className="nav-item" onClick={() => document.getElementById("discover")?.focus()}><Compass size={19} /> Discover</button>
          <button className={`nav-item ${filter === "liked" ? "active" : ""}`} onClick={() => setFilter("liked")}><Heart size={19} /> Liked posts <span className="nav-pill">{likedCount}</span></button>
          <button className="nav-item" onClick={() => setSearch("community")}><Users size={19} /> Communities</button>
          <button className="nav-item" onClick={() => setError("Messaging is a UI demo and isn't connected to a messaging service.")}><MessageCircle size={19} /> Messages</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><Sparkles size={17} /><strong>Good things happen when we connect.</strong><p>Find a new idea in today's feed.</p></div>
          <button className="nav-item" onClick={() => setError("This demo doesn't require sign-in.")}><Settings size={19} /> Settings</button>
          <button className="nav-item" onClick={() => setError("Sign-in is not configured in this demo.")}><LogIn size={19} /> Sign in</button>
        </div>
        <div className="sidebar-footer">Made for your corner of the internet ✦</div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark"><Sparkles size={17} /></span> loop<span className="brand-dot">.</span></div>
          <div className="topbar-label">Your daily dose of community</div>
          <div className="topbar-actions">
            <button className="round-button" aria-label="Notifications" title="Notifications" onClick={() => setError("You’re all caught up!") }><Bell size={19} /></button>
            <button className="profile-avatar top-avatar" aria-label="Profile">P</button>
          </div>
        </header>

        <section className="content-wrap">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">MONDAY MOOD, ANY DAY</p>
              <h1>Good to see you <span>✦</span></h1>
              <p className="welcome-subtitle">A little inspiration from people around the world.</p>
            </div>
            <button className="refresh-button" onClick={() => void load()} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh feed</button>
          </div>

          <div className="feed-layout">
            <section className="feed-column" aria-label="Social feed">
              <div className="composer">
                <div className="profile-avatar">P</div>
                <button className="composer-input" onClick={() => setError("Post creation is a UI preview. Connect a backend to publish posts.")}>Share something positive with the community...</button>
                <button className="composer-add" aria-label="Create post" onClick={() => setError("Post creation is a UI preview. Connect a backend to publish posts.")}><Plus size={20} /></button>
              </div>

              <div className="feed-toolbar">
                <div><h2>Your feed</h2><span>{loading ? "Loading posts…" : `${visiblePosts.length} posts to explore`}</span></div>
                <div className="filter-tabs">
                  <button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>For you</button>
                  <button className={filter === "liked" ? "selected" : ""} onClick={() => setFilter("liked")}>Liked</button>
                </div>
              </div>

              <label className="search-box" htmlFor="discover">
                <Search size={18} />
                <input id="discover" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search posts, people, ideas..." />
                {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}
              </label>

              {error && (
                <div className="notice" role="status">
                  <span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss message"><X size={16} /></button>
                </div>
              )}

              {loading && posts.length === 0 ? (
                <div className="state-card"><LoaderCircle className="spin" size={28} /><strong>Finding your people...</strong><span>Loading posts from the community</span></div>
              ) : error && posts.length === 0 ? (
                <div className="state-card"><MessageCircle size={28} /><strong>We couldn't load the feed</strong><span>{error}</span><button className="primary-button" onClick={() => void load()}>Try again</button></div>
              ) : visiblePosts.length ? (
                <div className="post-list">
                  {visiblePosts.map((post) => <PostCard key={post.id} post={post} onToggleLike={toggleLike} onOpen={setSelectedPost} />)}
                </div>
              ) : (
                <div className="state-card"><Search size={28} /><strong>No posts found</strong><span>Try another search or switch back to all posts.</span><button className="primary-button" onClick={() => { setSearch(""); setFilter("all"); }}>Show all posts</button></div>
              )}
              <p className="end-note">You’re all caught up <span>✦</span></p>
            </section>

            <aside className="right-column">
              <div className="side-card mini-hero">
                <div className="mini-hero-icon"><Sparkles size={22} /></div>
                <p className="eyebrow">A REMINDER</p>
                <h3>Your story matters.</h3>
                <p>Every little thought can spark something wonderful in someone else.</p>
                <button onClick={() => setError("Keep exploring — your next inspiration may be one scroll away.")}>Explore the feed <span>↗</span></button>
              </div>
              <div className="side-card trends-card">
                <div className="side-card-heading"><h3>Trending topics</h3><span>✦</span></div>
                {[
                  ["#SmallWins", "2.4k conversations"],
                  ["#CreativeMinds", "1.8k conversations"],
                  ["#DailyInspiration", "956 conversations"],
                  ["#SlowLiving", "721 conversations"],
                ].map(([tag, count]) => (
                  <button className="trend-row" key={tag} onClick={() => setSearch(tag.replace("#", ""))}><strong>{tag}</strong><span>{count}</span></button>
                ))}
              </div>
              <div className="side-card community-card">
                <div className="community-icon"><Users size={20} /></div>
                <div><strong>Stay curious</strong><p>Explore different perspectives and ideas from the community.</p></div>
              </div>
              <div className="right-footer">About · Guidelines · Privacy<br />© 2026 Loop Social Demo</div>
            </aside>
          </div>
        </section>
      </main>

      {selectedPost && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPost(null); }}>
          <section className="post-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" onClick={() => setSelectedPost(null)} aria-label="Close post"><X size={20} /></button>
            <div className="modal-author"><div className="avatar">{selectedPost.author.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</div><div><strong>{selectedPost.author.name}</strong><span>@{selectedPost.author.username.toLowerCase()}</span></div></div>
            <img className="modal-image" src={`https://picsum.photos/seed/social-feed-${selectedPost.id}/900/600`} alt="Post visual" />
            <h2 id="modal-title">{selectedPost.title}</h2>
            <p>{selectedPost.body}</p>
            <div className="modal-bottom"><button className={`primary-button ${selectedPost.liked ? "is-liked" : ""}`} onClick={() => toggleLike(selectedPost.id)}><Heart size={17} fill={selectedPost.liked ? "currentColor" : "none"} /> {selectedPost.liked ? "Liked" : "Like this post"}</button><span>Demo post · #{selectedPost.id}</span></div>
          </section>
        </div>
      )}
    </div>
  );
}