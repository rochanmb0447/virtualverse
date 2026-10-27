import { useEffect, useMemo, useState } from "react";
import {
  Sparkles, Compass, Heart, Map, Brain, Settings as SettingsIcon,
  Search, Star, ArrowUpDown, GitCompare, ChevronRight, ChevronLeft,
  Play, Pause, Sun, Moon, Type, Layout, X, CheckCircle, RotateCcw,
  Clock, Eye, BookOpen, Trophy, Trash2, Plus, FolderHeart, BookmarkPlus,
  Lightbulb, BarChart3, ArrowRight
} from "lucide-react";
import "./App.css";

const EXHIBITS = [
  {
    id: 1, name: "The Starry Night", artist: "Vincent van Gogh",
    category: "Painting", origin: "Netherlands", year: "1889",
    rating: 4.9, popularity: 98,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
    description: "Explore a swirling night sky, luminous stars and a quiet village in this iconic post-impressionist masterpiece.",
    fact: "Van Gogh painted this view while staying at an asylum in Saint-Rémy-de-Provence."
  },
  {
    id: 2, name: "Future Forms", artist: "Digital Futures Studio",
    category: "Digital Art", origin: "Japan", year: "2025",
    rating: 4.8, popularity: 95,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=85",
    description: "A digital exploration of imagined spaces, futuristic structures and the meeting point of art and technology.",
    fact: "Digital art can combine illustration, animation, generative systems and interactive media."
  },
  {
    id: 3, name: "Ancient Golden Mask", artist: "Ancient Egyptian artisans",
    category: "Artifact", origin: "Egypt", year: "1323 BCE",
    rating: 4.8, popularity: 91,
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=85",
    description: "Discover the craftsmanship and symbolism of ancient funerary art, created to honour rulers and preserve cultural traditions.",
    fact: "Ancient Egyptian funerary objects often reflected beliefs about the afterlife."
  },
  {
    id: 4, name: "Abstract Dimensions", artist: "Modern art collection",
    category: "Digital Art", origin: "United States", year: "2024",
    rating: 4.7, popularity: 88,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
    description: "A vibrant exploration of color, geometry and visual rhythm in contemporary abstract composition.",
    fact: "Abstract art can communicate through color, form and movement without depicting realistic subjects."
  },
  {
    id: 5, name: "The Thinker", artist: "Auguste Rodin",
    category: "Sculpture", origin: "France", year: "1904",
    rating: 4.6, popularity: 84,
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
    description: "A celebrated sculpture representing contemplation, reflection and the complexity of human thought.",
    fact: "Rodin first conceived the figure as part of a larger work inspired by Dante's Divine Comedy."
  },
  {
    id: 6, name: "The Ancient Colosseum", artist: "Roman architects",
    category: "Artifact", origin: "Italy", year: "80 CE",
    rating: 4.7, popularity: 89,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=85",
    description: "Explore the engineering and public life surrounding one of the most recognisable structures of ancient Rome.",
    fact: "The Colosseum was used for public spectacles and could accommodate a very large audience."
  }
];

const QUIZ = [
  {
    question: "Who painted The Starry Night?",
    options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"],
    answer: 1,
    explanation: "Vincent van Gogh painted The Starry Night in 1889."
  },
  {
    question: "Which civilisation built the Colosseum?",
    options: ["Ancient Greek", "Ancient Egyptian", "Roman", "Mayan"],
    answer: 2,
    explanation: "The Colosseum was built in ancient Rome."
  },
  {
    question: "Which category is most associated with three-dimensional artworks?",
    options: ["Sculpture", "Watercolour", "Photography", "Typography"],
    answer: 0,
    explanation: "Sculptures are three-dimensional works made by carving, modelling, casting or other methods."
  },
  {
    question: "What can digital art include?",
    options: ["Only oil paint", "Only stone carving", "Digital illustration and interactive media", "Only ancient manuscripts"],
    answer: 2,
    explanation: "Digital art includes digital illustration, animation and interactive media."
  },
  {
    question: "What is a common purpose of museum artifacts?",
    options: ["To preserve evidence of past cultures", "To replace all historical records", "To prevent research", "To eliminate cultural traditions"],
    answer: 0,
    explanation: "Artifacts help us study the people, practices and cultures of the past."
  }
];

const NAV_ITEMS = [
  { name: "Explore", icon: Compass },
  { name: "Favorites", icon: Heart },
  { name: "My Collections", icon: FolderHeart },
  { name: "Virtual Tour", icon: Map },
  { name: "Knowledge Quiz", icon: Brain },
  { name: "Analytics", icon: BarChart3 },
  { name: "Settings", icon: SettingsIcon }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [page, setPage] = useState("Explore");
  const [favorites, setFavorites] = useState(() => readStorage("vv-favorites", []));
  const [recent, setRecent] = useState(() => readStorage("vv-recent", []));
  const [scores, setScores] = useState(() => readStorage("vv-quiz-scores", []));
  const [collections, setCollections] = useState(() => readStorage("vv-collections", []));
  const [theme, setTheme] = useState(() => localStorage.getItem("vv-theme") || "light");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("vv-font-size") || "medium");
  const [readingLayout, setReadingLayout] = useState(() => localStorage.getItem("vv-reading-layout") || "comfortable");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Exhibits");
  const [sortBy, setSortBy] = useState("Most popular");
  const [minRating, setMinRating] = useState("0");
  const [minPopularity, setMinPopularity] = useState("0");
  const [dateAfter, setDateAfter] = useState("");
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [tourIndex, setTourIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const [newCollectionName, setNewCollectionName] = useState("");
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [collectionMessage, setCollectionMessage] = useState("");

  useEffect(() => localStorage.setItem("vv-favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("vv-recent", JSON.stringify(recent)), [recent]);
  useEffect(() => localStorage.setItem("vv-quiz-scores", JSON.stringify(scores)), [scores]);
  useEffect(() => localStorage.setItem("vv-collections", JSON.stringify(collections)), [collections]);

  useEffect(() => {
    localStorage.setItem("vv-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("vv-font-size", fontSize);
    document.documentElement.dataset.font = fontSize;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("vv-reading-layout", readingLayout);
    document.documentElement.dataset.reading = readingLayout;
  }, [readingLayout]);

  useEffect(() => {
    if (!autoplay || page !== "Virtual Tour") return undefined;
    const timer = window.setInterval(() => {
      setTourIndex(current => (current + 1) % EXHIBITS.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [autoplay, page]);

  const visibleExhibits = useMemo(() => {
    let items = [...EXHIBITS];

    if (page === "Favorites") {
      items = items.filter(item => favorites.includes(item.id));
    }

    if (page === "My Collections" && activeCollectionId !== null) {
      const collection = collections.find(item => item.id === activeCollectionId);
      items = items.filter(item => collection?.exhibitIds.includes(item.id));
    }

    if (category !== "All Exhibits" && page === "Explore") {
      items = items.filter(item => item.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(item =>
        [item.name, item.artist, item.category, item.origin, item.description]
          .some(value => value.toLowerCase().includes(q))
      );
    }

    items = items.filter(item =>
      item.rating >= Number(minRating) &&
      item.popularity >= Number(minPopularity)
    );

    if (dateAfter) {
      items = items.filter(item =>
        Number(item.year.match(/\d{1,4}/)?.[0] || 0) >=
        Number(dateAfter.slice(0, 4))
      );
    }

    if (sortBy === "Most popular") items.sort((a, b) => b.popularity - a.popularity);
    if (sortBy === "Highest rated") items.sort((a, b) => b.rating - a.rating);
    if (sortBy === "Name A–Z") items.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Newest") items.sort((a, b) => b.id - a.id);

    return items;
  }, [
    page, favorites, collections, activeCollectionId, category, query,
    sortBy, minRating, minPopularity, dateAfter
  ]);

  // Personalised recommendations use the categories of exhibits the visitor likes.
  const recommendations = useMemo(() => {
    const favoriteCategories = EXHIBITS
      .filter(item => favorites.includes(item.id))
      .map(item => item.category);

    const recentCategories = EXHIBITS
      .filter(item => recent.includes(item.id))
      .map(item => item.category);

    const preferredCategories = [...favoriteCategories, ...recentCategories];

    return [...EXHIBITS]
      .filter(item => !favorites.includes(item.id))
      .sort((a, b) => {
        const aMatch = preferredCategories.filter(value => value === a.category).length;
        const bMatch = preferredCategories.filter(value => value === b.category).length;
        return bMatch - aMatch || b.popularity - a.popularity;
      })
      .slice(0, 3);
  }, [favorites, recent]);

  function toggleFavorite(id) {
    setFavorites(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  }

  function openExhibit(exhibit) {
    setSelectedExhibit(exhibit);
    setRecent(current =>
      [exhibit.id, ...current.filter(id => id !== exhibit.id)].slice(0, 6)
    );
  }

  function toggleCompare(id) {
    setCompareIds(current => {
      if (current.includes(id)) return current.filter(item => item !== id);
      if (current.length >= 3) {
        window.alert("You can compare up to 3 exhibits at a time.");
        return current;
      }
      return [...current, id];
    });
  }

  function createCollection(event) {
    event.preventDefault();
    const name = newCollectionName.trim();

    if (!name) {
      setCollectionMessage("Please enter a collection name.");
      return;
    }

    if (collections.some(item => item.name.toLowerCase() === name.toLowerCase())) {
      setCollectionMessage("A collection with that name already exists.");
      return;
    }

    const newCollection = {
      id: Date.now(),
      name,
      exhibitIds: [],
      createdAt: new Date().toLocaleDateString()
    };

    setCollections(current => [...current, newCollection]);
    setActiveCollectionId(newCollection.id);
    setNewCollectionName("");
    setCollectionMessage(`"${name}" was created successfully.`);
  }

  function deleteCollection(id) {
    const collection = collections.find(item => item.id === id);
    if (!collection) return;

    if (!window.confirm(`Delete the collection "${collection.name}"? The exhibits themselves will not be deleted.`)) {
      return;
    }

    setCollections(current => current.filter(item => item.id !== id));
    if (activeCollectionId === id) setActiveCollectionId(null);
    setCollectionMessage("Collection deleted.");
  }

  function addToCollection(collectionId, exhibitId) {
    setCollections(current => current.map(collection => {
      if (collection.id !== collectionId) return collection;
      if (collection.exhibitIds.includes(exhibitId)) return collection;
      return { ...collection, exhibitIds: [...collection.exhibitIds, exhibitId] };
    }));

    const collection = collections.find(item => item.id === collectionId);
    setCollectionMessage(
      collection ? `Added to "${collection.name}".` : "Exhibit added."
    );
  }

  function removeFromCollection(collectionId, exhibitId) {
    setCollections(current => current.map(collection =>
      collection.id === collectionId
        ? { ...collection, exhibitIds: collection.exhibitIds.filter(id => id !== exhibitId) }
        : collection
    ));
    setCollectionMessage("Exhibit removed from collection.");
  }

  function startQuizAgain() {
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizFinished(false);
  }

  function chooseAnswer(optionIndex) {
    if (quizAnswers[quizIndex] !== undefined) return;
    setQuizAnswers(current => {
      const updated = [...current];
      updated[quizIndex] = optionIndex;
      return updated;
    });
  }

  function nextQuestion() {
    if (quizIndex < QUIZ.length - 1) {
      setQuizIndex(current => current + 1);
    } else {
      const finalScore = quizAnswers.reduce(
        (total, answer, index) => total + (answer === QUIZ[index].answer ? 1 : 0),
        0
      );
      setScores(current => [
        { score: finalScore, total: QUIZ.length, date: new Date().toLocaleDateString() },
        ...current
      ].slice(0, 10));
      setQuizFinished(true);
    }
  }

  function resetFilters() {
    setQuery("");
    setCategory("All Exhibits");
    setSortBy("Most popular");
    setMinRating("0");
    setMinPopularity("0");
    setDateAfter("");
  }

  const currentQuestion = QUIZ[quizIndex];
  const answered = quizAnswers[quizIndex] !== undefined;
  const finalScore = quizAnswers.reduce(
    (total, answer, index) => total + (answer === QUIZ[index].answer ? 1 : 0),
    0
  );
  const compareItems = EXHIBITS.filter(item => compareIds.includes(item.id));
  const activeCollection = collections.find(item => item.id === activeCollectionId);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage("Explore")} aria-label="VirtualVerse home">
          <span className="brand-mark"><Sparkles size={23} /></span>
          <span><strong>VirtualVerse</strong><small>DIGITAL EXHIBITIONS</small></span>
        </button>

        <p className="side-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-link ${page === name ? "active" : ""}`}
              onClick={() => {
                setPage(name);
                setSelectedExhibit(null);
                setAutoplay(false);
              }}
              aria-current={page === name ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Favorites" && favorites.length > 0 &&
                <span className="nav-count">{favorites.length}</span>}
              {name === "My Collections" && collections.length > 0 &&
                <span className="nav-count">{collections.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="discovery-card">
            <span className="mini-mark"><Sparkles size={17} /></span>
            <strong>A world of stories</strong>
            <p>Every exhibit has something new to discover.</p>
            <button onClick={() => setPage("Explore")}>
              Start exploring <ChevronRight size={15} />
            </button>
          </div>
          <div className="visitor">
            <span className="avatar">V</span>
            <span><strong>Visitor</strong><small>Art explorer</small></span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            Workspace <ChevronRight size={14} /> <strong>{page}</strong>
          </div>
          <div className="topbar-user">
            <span className="online-dot" /> Your discovery space
            <span className="avatar small">V</span>
          </div>
        </header>

        <div className="page-content">
          {page === "Explore" && (
            <>
              <PageHeading
                eyebrow="DISCOVER SOMETHING NEW"
                title="Explore exhibitions"
                description="Find art, stories and ideas from across time and cultures."
              />

              <ExhibitFilters
                query={query} setQuery={setQuery}
                category={category} setCategory={setCategory}
                sortBy={sortBy} setSortBy={setSortBy}
                minRating={minRating} setMinRating={setMinRating}
                minPopularity={minPopularity} setMinPopularity={setMinPopularity}
                                dateAfter={dateAfter} setDateAfter={setDateAfter}
                resetFilters={resetFilters}
              />

              <CompareBar
                count={compareIds.length}
                onCompare={() => setShowCompare(true)}
                onClear={() => setCompareIds([])}
              />

              <p className="results-label">{visibleExhibits.length} exhibitions to explore</p>

              <ExhibitGrid
                items={visibleExhibits}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                openExhibit={openExhibit}
                compareIds={compareIds}
                toggleCompare={toggleCompare}
                collections={collections}
                addToCollection={addToCollection}
              />

              <RecentSection recent={recent} openExhibit={openExhibit} />

              <section className="recommend-section">
                <div className="recommend-heading">
                  <div>
                    <p className="eyebrow">PICKED FOR YOUR JOURNEY</p>
                    <h2 className="section-title">Recommended for you</h2>
                    <p className="muted">
                      {favorites.length || recent.length
                        ? "Suggestions inspired by exhibits you've liked or viewed."
                        : "Popular exhibits to help you get started. Save favorites to personalise suggestions."}
                    </p>
                  </div>
                  <span className="recommend-icon"><Lightbulb size={22} /></span>
                </div>
                <ExhibitGrid
                  items={recommendations}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  openExhibit={openExhibit}
                  compareIds={compareIds}
                  toggleCompare={toggleCompare}
                  collections={collections}
                  addToCollection={addToCollection}
                />
              </section>
            </>
          )}

          {page === "Favorites" && (
            <>
              <PageHeading
                eyebrow="YOUR PERSONAL SPACE"
                title="Favorite exhibitions"
                description="The artworks and stories you've saved for another visit."
              />
              <div className="stats-row">
                <Stat icon={Heart} label="Saved exhibits" value={favorites.length} />
                <Stat icon={Eye} label="Recently viewed" value={recent.length} />
                <Stat icon={Trophy} label="Quiz attempts" value={scores.length} />
              </div>
              <h3 className="section-title">Your favorites</h3>
              {visibleExhibits.length ? (
                <ExhibitGrid
                  items={visibleExhibits}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  openExhibit={openExhibit}
                  compareIds={compareIds}
                  toggleCompare={toggleCompare}
                  collections={collections}
                  addToCollection={addToCollection}
                />
              ) : (
                <EmptyState
                  icon={Heart}
                  title="Your collection is waiting"
                  description="Tap the heart on an exhibit you like, and it will appear here."
                  action="Explore exhibitions"
                  onAction={() => setPage("Explore")}
                />
              )}
              <RecentSection recent={recent} openExhibit={openExhibit} />
            </>
          )}

          {page === "My Collections" && (
            <>
              <PageHeading
                eyebrow="CURATE YOUR OWN EXHIBITION"
                title="My Collections"
                description="Create themed collections and save the exhibits you want to revisit."
              />

              <section className="settings-card collection-create-card">
                <div className="settings-heading">
                  <span className="settings-icon"><FolderHeart size={20} /></span>
                  <div>
                    <h3>Create a collection</h3>
                    <p>Give your collection a name, such as “Ancient History” or “Art I Love”.</p>
                  </div>
                </div>
                <form className="collection-create-form" onSubmit={createCollection}>
                  <label className="collection-name-input">
                    <span>Collection name</span>
                    <input
                      value={newCollectionName}
                      onChange={event => setNewCollectionName(event.target.value)}
                      placeholder="e.g. My favourite digital art"
                      maxLength={50}
                      aria-label="New collection name"
                    />
                  </label>
                  <button className="primary-button" type="submit">
                    <Plus size={16} /> Create collection
                  </button>
                </form>
                {collectionMessage && (
                  <p className="collection-message" role="status">{collectionMessage}</p>
                )}
              </section>

              <div className="collection-summary">
                <div><FolderHeart size={20} /><span><strong>{collections.length}</strong> collections</span></div>
                <div><BookmarkPlus size={20} /><span><strong>{collections.reduce((sum, item) => sum + item.exhibitIds.length, 0)}</strong> saved items</span></div>
              </div>

              {collections.length === 0 ? (
                <EmptyState
                  icon={FolderHeart}
                  title="Start curating your own space"
                  description="Create your first collection, then add exhibits using the bookmark control on an exhibit card."
                />
              ) : (
                <>
                  <h3 className="section-title">Your collections</h3>
                  <div className="collection-grid">
                    {collections.map(collection => {
                      const selected = activeCollectionId === collection.id;
                      const preview = EXHIBITS.find(item => collection.exhibitIds.includes(item.id));
                      return (
                        <article className={`collection-card ${selected ? "collection-card-selected" : ""}`} key={collection.id}>
                          <div className="collection-cover">
                            {preview
                              ? <img src={preview.image} alt="" />
                              : <div className="collection-empty-cover"><FolderHeart size={35} /></div>}
                            <span>{collection.exhibitIds.length} {collection.exhibitIds.length === 1 ? "exhibit" : "exhibits"}</span>
                          </div>
                          <div className="collection-card-body">
                            <h3>{collection.name}</h3>
                            <p className="muted">Created {collection.createdAt}</p>
                            <div className="collection-card-actions">
                              <button
                                className={selected ? "secondary-button" : "primary-button"}
                                onClick={() => setActiveCollectionId(selected ? null : collection.id)}
                              >
                                {selected ? "Close collection" : "View collection"} <ArrowRight size={15} />
                              </button>
                              <button
                                className="icon-action-button"
                                onClick={() => deleteCollection(collection.id)}
                                aria-label={`Delete ${collection.name}`}
                                title="Delete collection"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}

              {activeCollection && (
                <section className="active-collection-section">
                  <div className="collection-section-heading">
                    <div>
                      <p className="eyebrow">YOUR CURATED EXHIBITION</p>
                      <h2 className="section-title">{activeCollection.name}</h2>
                    </div>
                    <button className="secondary-button" onClick={() => setActiveCollectionId(null)}>
                      <X size={15} /> Close
                    </button>
                  </div>
                  {visibleExhibits.length ? (
                    <ExhibitGrid
                      items={visibleExhibits}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      openExhibit={openExhibit}
                      compareIds={compareIds}
                      toggleCompare={toggleCompare}
                      collections={collections}
                      addToCollection={addToCollection}
                      removeFromCollection={removeFromCollection}
                      activeCollectionId={activeCollectionId}
                    />
                  ) : (
                    <EmptyState
                      icon={BookmarkPlus}
                      title="This collection is empty"
                      description="Go to Explore and use the bookmark control on an exhibit to add it here."
                      action="Explore exhibits"
                      onAction={() => setPage("Explore")}
                    />
                  )}
                </section>
              )}

              <section className="collection-tip">
                <Sparkles size={18} />
                <p><strong>Curator tip:</strong> Build collections around a theme, time period, artist or style to create your own virtual exhibition.</p>
              </section>
            </>
          )}

          {page === "Virtual Tour" && (
            <>
              <PageHeading
                eyebrow="A GUIDED JOURNEY"
                title="Virtual tour"
                description="Move through selected exhibits at your own pace."
              />

              <section className="tour-viewer">
                <div className="tour-image-wrap">
                  <img
                    src={EXHIBITS[tourIndex].image}
                    alt={EXHIBITS[tourIndex].name}
                    className="tour-image"
                  />
                  <div className="tour-image-overlay" />
                  <button
                    className="tour-nav tour-prev"
                    onClick={() => setTourIndex(index => (index - 1 + EXHIBITS.length) % EXHIBITS.length)}
                    aria-label="Previous exhibit"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    className="tour-nav tour-next"
                    onClick={() => setTourIndex(index => (index + 1) % EXHIBITS.length)}
                    aria-label="Next exhibit"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <div className="tour-image-caption">
                    <span>STOP {tourIndex + 1} OF {EXHIBITS.length}</span>
                    <h2>{EXHIBITS[tourIndex].name}</h2>
                    <p>{EXHIBITS[tourIndex].artist} · {EXHIBITS[tourIndex].year}</p>
                  </div>
                </div>
                <div className="tour-controls">
                  <div className="tour-dots">
                    {EXHIBITS.map((item, index) => (
                      <button
                        key={item.id}
                        className={index === tourIndex ? "active" : ""}
                        onClick={() => setTourIndex(index)}
                        aria-label={`Go to ${item.name}`}
                      />
                    ))}
                  </div>
                  <button className="primary-button" onClick={() => setAutoplay(value => !value)}>
                    {autoplay ? <Pause size={16} /> : <Play size={16} />}
                    {autoplay ? "Pause tour" : "Auto-play tour"}
                  </button>
                </div>
              </section>

              <section className="tour-details">
                <div>
                  <p className="eyebrow">ABOUT THIS EXHIBIT</p>
                  <h2 className="section-title">{EXHIBITS[tourIndex].name}</h2>
                  <p>{EXHIBITS[tourIndex].description}</p>
                </div>
                <aside className="fact-card">
                  <span><Lightbulb size={18} /> DID YOU KNOW?</span>
                  <p>{EXHIBITS[tourIndex].fact}</p>
                </aside>
              </section>
              <button className="secondary-button" onClick={() => openExhibit(EXHIBITS[tourIndex])}>
                View exhibit details <ArrowRight size={16} />
              </button>
            </>
          )}

          {page === "Knowledge Quiz" && (
            <>
              <PageHeading
                eyebrow="TEST YOUR KNOWLEDGE"
                title="Knowledge quiz"
                description="Challenge yourself with questions about art, history and culture."
              />
              <div className="quiz-layout">
                <section className="quiz-card">
                  {!quizFinished ? (
                    <>
                      <div className="quiz-topline">
                        <span>QUESTION {quizIndex + 1} OF {QUIZ.length}</span>
                        <span>{Math.round((quizIndex / QUIZ.length) * 100)}% complete</span>
                      </div>
                      <div className="quiz-progress">
                        <div style={{ width: `${(quizIndex / QUIZ.length) * 100}%` }} />
                      </div>
                      <div className="quiz-icon"><Brain size={25} /></div>
                      <h2>{currentQuestion.question}</h2>
                      <div className="quiz-options">
                        {currentQuestion.options.map((option, index) => {
                          const isCorrect = answered && index === currentQuestion.answer;
                          const isWrong = answered && quizAnswers[quizIndex] === index && !isCorrect;
                          return (
                            <button
                              key={option}
                              className={`quiz-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                              onClick={() => chooseAnswer(index)}
                              disabled={answered}
                            >
                              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                              {option}
                              {isCorrect && <CheckCircle size={18} />}
                              {isWrong && <X size={18} />}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div className="answer-explanation">
                          <strong>{quizAnswers[quizIndex] === currentQuestion.answer ? "Well done!" : "Not quite!"}</strong>
                          <p>{currentQuestion.explanation}</p>
                        </div>
                      )}
                      <div className="quiz-footer">
                        <span className="muted">Score: {finalScore} / {quizIndex + (answered ? 1 : 0)}</span>
                        <button className="primary-button" disabled={!answered} onClick={nextQuestion}>
                          {quizIndex === QUIZ.length - 1 ? "See results" : "Next question"} <ChevronRight size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="quiz-result">
                      <div className="result-trophy"><Trophy size={36} /></div>
                      <p className="eyebrow">QUIZ COMPLETED</p>
                      <h2>{finalScore >= 4 ? "Excellent work!" : finalScore >= 3 ? "Nice effort!" : "Keep exploring!"}</h2>
                      <div className="score-number">{finalScore}<span> / {QUIZ.length}</span></div>
                      <p>You answered {finalScore} out of {QUIZ.length} questions correctly.</p>
                      <div className="result-actions">
                        <button className="primary-button" onClick={startQuizAgain}><RotateCcw size={16} /> Try again</button>
                        <button className="secondary-button" onClick={() => setPage("Explore")}>Explore exhibits</button>
                      </div>
                    </div>
                  )}
                </section>

                <aside className="quiz-side-card">
                  <div className="quiz-icon"><BookOpen size={23} /></div>
                  <h3>Your learning journey</h3>
                  <p className="muted">Answer each question to test your knowledge. Your results are saved on this device.</p>
                  <div className="learning-stat"><span>Questions</span><strong>{QUIZ.length}</strong></div>
                  <div className="learning-stat"><span>Past attempts</span><strong>{scores.length}</strong></div>
                  <div className="learning-stat">
                    <span>Best score</span>
                    <strong>{scores.length ? `${Math.max(...scores.map(score => score.score))}/${QUIZ.length}` : "—"}</strong>
                  </div>
                  {scores.length > 0 && (
                    <button className="text-button" onClick={() => setScores([])}>
                      <Trash2 size={14} /> Clear score history
                    </button>
                  )}
                </aside>
              </div>
            </>
          )}
                    {page === "Analytics" && (() => {
            const categoryStats = [...new Set(EXHIBITS.map(item => item.category))].map(name => ({
              name,
              count: EXHIBITS.filter(item => item.category === name).length
            }));
            const bestScore = scores.length ? Math.max(...scores.map(item => Number(item.score) || 0)) : 0;
            const averageScore = scores.length
              ? Math.round(scores.reduce((sum, item) => sum + ((Number(item.score) || 0) / (Number(item.total) || QUIZ.length)) * 100, 0) / scores.length)
              : 0;
            const viewedCount = new Set(recent).size;
            const favoriteRate = EXHIBITS.length ? Math.round((favorites.length / EXHIBITS.length) * 100) : 0;
            const maxCategoryCount = Math.max(1, ...categoryStats.map(item => item.count));

            return (
              <>
                <PageHeading
                  eyebrow="YOUR VIRTUALVERSE OVERVIEW"
                  title="Analytics dashboard"
                  description="Track your discoveries, saved exhibits, collections and learning progress."
                />

                <div className="analytics-grid analytics-stats-grid">
                  <Stat icon={Eye} label="Recently viewed" value={viewedCount} />
                  <Stat icon={Heart} label="Favorite exhibits" value={favorites.length} />
                  <Stat icon={FolderHeart} label="My collections" value={collections.length} />
                  <Stat icon={Trophy} label="Quiz attempts" value={scores.length} />
                </div>

                <div className="analytics-grid analytics-main-grid">
                  <section className="settings-card analytics-card">
                    <div className="analytics-card-heading">
                      <div>
                        <p className="eyebrow">EXHIBITION LIBRARY</p>
                        <h2 className="section-title">Exhibits by category</h2>
                      </div>
                      <span className="recommend-icon"><BarChart3 size={21} /></span>
                    </div>
                    <p className="muted analytics-description">Browse the current library by art type.</p>
                    <div className="analytics-bars">
                      {categoryStats.map(item => (
                        <div className="analytics-bar-item" key={item.name}>
                          <div className="analytics-bar-label">
                            <span>{item.name}</span>
                            <strong>{item.count}</strong>
                          </div>
                          <div className="analytics-bar-track">
                            <div
                              className="analytics-bar-fill"
                              style={{ width: `${(item.count / maxCategoryCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="analytics-footnote">{EXHIBITS.length} exhibits available in total</div>
                    <button className="text-button analytics-action" onClick={() => setPage("Explore")}>
                      Explore exhibits <ArrowRight size={15} />
                    </button>
                  </section>

                  <section className="settings-card analytics-card">
                    <div className="analytics-card-heading">
                      <div>
                        <p className="eyebrow">KNOWLEDGE CHECK</p>
                        <h2 className="section-title">Quiz performance</h2>
                      </div>
                      <span className="recommend-icon"><Trophy size={21} /></span>
                    </div>
                    {scores.length ? (
                      <>
                        <div className="analytics-score-row">
                          <div className="analytics-score">
                            <strong>{averageScore}%</strong>
                            <span>Average score</span>
                          </div>
                          <div className="analytics-score">
                            <strong>{bestScore}/{scores[0]?.total || QUIZ.length}</strong>
                            <span>Best result</span>
                          </div>
                        </div>
                        <h3 className="analytics-subheading">Recent attempts</h3>
                        <div className="analytics-history-list">
                          {scores.slice(0, 4).map((item, index) => {
                            const total = Number(item.total) || QUIZ.length;
                            const percent = Math.round(((Number(item.score) || 0) / total) * 100);
                            return (
                              <div className="analytics-history-row" key={`${item.date}-${index}`}>
                                <span>
                                  <strong>{item.date || "Saved attempt"}</strong>
                                  <small>{item.score} of {total} correct</small>
                                </span>
                                <strong>{percent}%</strong>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="analytics-empty">
                        <p className="muted">Complete a knowledge quiz to see your scores and learning progress here.</p>
                        <button className="primary-button" onClick={() => setPage("Knowledge Quiz")}>
                          Take the quiz <ChevronRight size={15} />
                        </button>
                      </div>
                    )}
                  </section>

                  <section className="settings-card analytics-card">
                    <div className="analytics-card-heading">
                      <div>
                        <p className="eyebrow">DISCOVERY ACTIVITY</p>
                        <h2 className="section-title">Your exploration</h2>
                      </div>
                      <span className="recommend-icon"><Compass size={21} /></span>
                    </div>
                    <div className="analytics-summary-list">
                      <div className="analytics-summary-row">
                        <span>Unique exhibits viewed</span>
                        <strong>{viewedCount}</strong>
                      </div>
                      <div className="analytics-summary-row">
                        <span>Not yet viewed</span>
                        <strong>{Math.max(0, EXHIBITS.length - viewedCount)}</strong>
                      </div>
                      <div className="analytics-summary-row">
                        <span>Library saved as favorites</span>
                        <strong>{favoriteRate}%</strong>
                      </div>
                      <div className="analytics-summary-row">
                        <span>Saved collection items</span>
                        <strong>{collections.reduce((sum, item) => sum + (item.exhibitIds?.length || 0), 0)}</strong>
                      </div>
                    </div>
                    <button className="text-button analytics-action" onClick={() => setPage("Favorites")}>
                      View favorites <ArrowRight size={15} />
                    </button>
                  </section>

                  <section className="settings-card analytics-card">
                    <div className="analytics-card-heading">
                      <div>
                        <p className="eyebrow">PERSONAL LIBRARY</p>
                        <h2 className="section-title">Collection insights</h2>
                      </div>
                      <span className="recommend-icon"><FolderHeart size={21} /></span>
                    </div>
                    {collections.length ? (
                      <div className="analytics-history-list">
                        {collections.slice(0, 5).map(collection => (
                          <div className="analytics-history-row" key={collection.id}>
                            <span>
                              <strong>{collection.name}</strong>
                              <small>{collection.createdAt || "Custom collection"}</small>
                            </span>
                            <strong>{collection.exhibitIds?.length || 0} items</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="analytics-empty">
                        <p className="muted">Create collections to group the exhibits you want to revisit.</p>
                        <button className="primary-button" onClick={() => setPage("My Collections")}>
                          Create a collection <ChevronRight size={15} />
                        </button>
                      </div>
                    )}
                    {collections.length > 0 && (
                      <button
                        className="text-button analytics-action"
                        onClick={() => {
                          setActiveCollectionId(null);
                          setPage("My Collections");
                        }}
                      >
                        Manage collections <ArrowRight size={15} />
                      </button>
                    )}
                  </section>
                </div>
              </>
            );
          })()}

          {page === "Settings" && (
            <>
              <PageHeading
                eyebrow="MAKE IT YOUR SPACE"
                title="Settings"
                description="Personalise the way you explore VirtualVerse."
              />
              <div className="settings-layout">
                <section className="settings-card">
                  <div className="settings-heading">
                    <span className="settings-icon"><Sun size={20} /></span>
                    <div><h3>Appearance</h3><p>Choose the look that feels right for you.</p></div>
                  </div>
                  <div className="setting-row">
                    <div><strong>Colour theme</strong><p>Switch between light and dark mode.</p></div>
                    <div className="choice-group">
                      <button className={theme === "light" ? "chosen" : ""} onClick={() => setTheme("light")}><Sun size={16} /> Light</button>
                      <button className={theme === "dark" ? "chosen" : ""} onClick={() => setTheme("dark")}><Moon size={16} /> Dark</button>
                    </div>
                  </div>
                </section>

                <section className="settings-card">
                  <div className="settings-heading">
                    <span className="settings-icon"><Type size={20} /></span>
                    <div><h3>Reading preferences</h3><p>Adjust text size and reading space.</p></div>
                  </div>
                  <div className="setting-row">
                    <div><strong>Font size</strong><p>Change the size of text across the app.</p></div>
                    <div className="choice-group">
                      {[["small", "Small"], ["medium", "Medium"], ["large", "Large"]].map(([value, label]) => (
                        <button key={value} className={fontSize === value ? "chosen" : ""} onClick={() => setFontSize(value)}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="setting-row">
                    <div><strong>Reading layout</strong><p>Choose your preferred content spacing.</p></div>
                    <div className="choice-group">
                      <button className={readingLayout === "comfortable" ? "chosen" : ""} onClick={() => setReadingLayout("comfortable")}><Layout size={15} /> Comfortable</button>
                      <button className={readingLayout === "compact" ? "chosen" : ""} onClick={() => setReadingLayout("compact")}>Compact</button>
                    </div>
                  </div>
                </section>

                <section className="settings-card">
                  <div className="settings-heading">
                    <span className="settings-icon"><Clock size={20} /></span>
                    <div><h3>Your activity</h3><p>Saved locally in this browser on this device.</p></div>
                  </div>
                  <div className="setting-row">
                    <div><strong>Recently viewed</strong><p>{recent.length} exhibits in your history.</p></div>
                    <button className="secondary-button" onClick={() => setRecent([])} disabled={recent.length === 0}>
                      <Trash2 size={15} /> Clear history
                    </button>
                  </div>
                  <div className="setting-row">
                    <div><strong>Quiz score history</strong><p>{scores.length} saved quiz attempts.</p></div>
                    <button className="secondary-button" onClick={() => setScores([])} disabled={scores.length === 0}>
                      <Trash2 size={15} /> Clear scores
                    </button>
                  </div>
                  <div className="setting-row">
                    <div><strong>Reset all preferences</strong><p>Reset filters, reading options and tour playback.</p></div>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        resetFilters();
                        setTheme("light");
                        setFontSize("medium");
                        setReadingLayout("comfortable");
                        setAutoplay(false);
                        setTourIndex(0);
                      }}
                    >
                      <RotateCcw size={15} /> Reset preferences
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>

      {selectedExhibit && (
        <div className="modal-backdrop" onClick={() => setSelectedExhibit(null)}>
          <section
            className="exhibit-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedExhibit.name}
            onClick={event => event.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedExhibit(null)} aria-label="Close details">
              <X size={20} />
            </button>
            <img src={selectedExhibit.image} alt={selectedExhibit.name} className="modal-image" />
            <div className="modal-body">
              <p className="eyebrow">{selectedExhibit.category} · {selectedExhibit.origin}</p>
              <h2>{selectedExhibit.name}</h2>
              <p className="modal-artist">{selectedExhibit.artist} · {selectedExhibit.year}</p>
              <div className="modal-rating"><Star size={16} fill="currentColor" /> {selectedExhibit.rating} <span>· Popularity {selectedExhibit.popularity}%</span></div>
              <p>{selectedExhibit.description}</p>
              <div className="modal-fact"><Lightbulb size={18} /><p>{selectedExhibit.fact}</p></div>
              <div className="modal-actions">
                <button className={favorites.includes(selectedExhibit.id) ? "secondary-button" : "primary-button"} onClick={() => toggleFavorite(selectedExhibit.id)}>
                  <Heart size={16} fill={favorites.includes(selectedExhibit.id) ? "currentColor" : "none"} />
                  {favorites.includes(selectedExhibit.id) ? "Saved to favorites" : "Add to favorites"}
                </button>
                <button className="secondary-button" onClick={() => toggleCompare(selectedExhibit.id)}>
                  <GitCompare size={16} /> {compareIds.includes(selectedExhibit.id) ? "Remove comparison" : "Compare"}
                </button>
              </div>
              {collections.length > 0 && (
                <div className="modal-collection-actions">
                  <label htmlFor="modal-collection">Add to a collection</label>
                  <select
                    id="modal-collection"
                    defaultValue=""
                    onChange={event => {
                      if (event.target.value) addToCollection(Number(event.target.value), selectedExhibit.id);
                      event.target.value = "";
                    }}
                  >
                    <option value="" disabled>Choose a collection</option>
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>{collection.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {showCompare && (
        <div className="modal-backdrop" onClick={() => setShowCompare(false)}>
          <section className="compare-modal" role="dialog" aria-modal="true" aria-label="Compare exhibits" onClick={event => event.stopPropagation()}>
            <div className="compare-modal-heading">
              <div><p className="eyebrow">SIDE-BY-SIDE</p><h2>Compare exhibits</h2></div>
              <button className="modal-close inline" onClick={() => setShowCompare(false)} aria-label="Close comparison"><X size={20} /></button>
            </div>
            {compareItems.length ? (
              <div className="compare-table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr><th>Detail</th>{compareItems.map(item => <th key={item.id}>{item.name}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr><td>Artist</td>{compareItems.map(item => <td key={item.id}>{item.artist}</td>)}</tr>
                    <tr><td>Category</td>{compareItems.map(item => <td key={item.id}>{item.category}</td>)}</tr>
                    <tr><td>Origin</td>{compareItems.map(item => <td key={item.id}>{item.origin}</td>)}</tr>
                    <tr><td>Year</td>{compareItems.map(item => <td key={item.id}>{item.year}</td>)}</tr>
                    <tr><td>Rating</td>{compareItems.map(item => <td key={item.id}><Star size={13} fill="currentColor" /> {item.rating}</td>)}</tr>
                    <tr><td>Popularity</td>{compareItems.map(item => <td key={item.id}>{item.popularity}%</td>)}</tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon={GitCompare} title="Nothing to compare" description="Select exhibits from Explore to compare their details." />
            )}
            <div className="compare-modal-footer">
              <span className="muted">{compareItems.length} of 3 exhibits selected</span>
              <button className="primary-button" onClick={() => setShowCompare(false)}>Done</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </div>
  );
}

function ExhibitFilters({
  query, setQuery, category, setCategory, sortBy, setSortBy,
  minRating, setMinRating, minPopularity, setMinPopularity,
  dateAfter, setDateAfter, resetFilters
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <section className="filters-panel">
      <div className="search-wrap">
        <Search size={18} />
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search exhibits, artists, places..."
          aria-label="Search exhibits"
        />
        {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
      </div>
      <div className="filter-controls">
        <label>
          <span>Category</span>
          <select value={category} onChange={event => setCategory(event.target.value)}>
            <option>All Exhibits</option>
            {[...new Set(EXHIBITS.map(item => item.category))].map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select value={sortBy} onChange={event => setSortBy(event.target.value)}>
            <option>Most popular</option>
            <option>Highest rated</option>
            <option>Name A–Z</option>
            <option>Newest</option>
          </select>
        </label>
        <button className="filter-toggle" onClick={() => setShowAdvanced(value => !value)}>
          <ArrowUpDown size={16} /> {showAdvanced ? "Hide filters" : "More filters"}
        </button>
        <button className="reset-filters" onClick={resetFilters}>Reset</button>
      </div>
      {showAdvanced && (
        <div className="advanced-filters">
          <label><span>Minimum rating</span><select value={minRating} onChange={event => setMinRating(event.target.value)}><option value="0">Any rating</option><option value="4.5">4.5 and above</option><option value="4.8">4.8 and above</option></select></label>
          <label><span>Minimum popularity</span><select value={minPopularity} onChange={event => setMinPopularity(event.target.value)}><option value="0">Any popularity</option><option value="85">85% and above</option><option value="90">90% and above</option><option value="95">95% and above</option></select></label>
          <label><span>Year from</span><input type="number" value={dateAfter ? dateAfter.slice(0, 4) : ""} onChange={event => setDateAfter(event.target.value)} placeholder="e.g. 1900" min="0" /></label>
        </div>
      )}
    </section>
  );
}

function CompareBar({ count, onCompare, onClear }) {
  if (count === 0) return null;
  return (
    <div className="compare-bar">
      <span><GitCompare size={17} /> {count} {count === 1 ? "exhibit" : "exhibits"} selected</span>
      <div>
        <button className="text-button" onClick={onClear}>Clear</button>
        <button className="primary-button" onClick={onCompare}>Compare exhibits <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}


function ExhibitGrid({
  items,
  favorites,
  toggleFavorite,
  openExhibit,
  compareIds,
  toggleCompare,
  collections,
  addToCollection,
  removeFromCollection,
  activeCollectionId
}) {
  if (!items.length) {
    return (
      <EmptyState
        icon={Search}
        title="No exhibits found"
        description="Try changing your search or filters to discover something else."
      />
    );
  }

  return (
    <div className="exhibit-grid">
      {items.map(item => {
        const isFavorite = favorites.includes(item.id);
        const isCompared = compareIds.includes(item.id);

        const activeCollection = collections.find(
          collection => collection.id === activeCollectionId
        );

        const isInActiveCollection =
          Boolean(activeCollection?.exhibitIds.includes(item.id));

        return (
          <article className="exhibit-card" key={item.id}>
            <button
              className="exhibit-image-button"
              onClick={() => openExhibit(item)}
              aria-label={`View ${item.name}`}
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
              />
              <span className="category-pill">{item.category}</span>
            </button>

            <div className="exhibit-card-body">
              <div className="exhibit-card-topline">
                <span className="exhibit-origin">
                  {item.origin} · {item.year}
                </span>

                <span className="rating">
                  <Star size={13} fill="currentColor" />
                  {item.rating}
                </span>
              </div>

              <button
                className="exhibit-title-button"
                onClick={() => openExhibit(item)}
              >
                <h3>{item.name}</h3>
              </button>

              <p className="exhibit-artist">{item.artist}</p>

              <p className="exhibit-description">
                {item.description}
              </p>

              <div className="exhibit-card-footer">
                <button
                  className={`icon-action-button ${
                    isFavorite ? "is-favorite" : ""
                  }`}
                  onClick={() => toggleFavorite(item.id)}
                  aria-label={
                    isFavorite ? "Remove favorite" : "Add favorite"
                  }
                  title={isFavorite ? "Remove favorite" : "Add favorite"}
                >
                  <Heart
                    size={17}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>

                <button
                  className={`icon-action-button ${
                    isCompared ? "is-selected" : ""
                  }`}
                  onClick={() => toggleCompare(item.id)}
                  aria-label={
                    isCompared
                      ? "Remove from comparison"
                      : "Compare exhibit"
                  }
                  title="Compare"
                >
                  <GitCompare size={16} />
                </button>

                {collections.length > 0 && (
                  <select
                    key={`${item.id}-${activeCollectionId ?? "all"}`}
                    className="card-collection-select"
                    defaultValue=""
                    onChange={event => {
                      const value = event.target.value;

                      if (!value) return;

                      if (value === "remove" && activeCollectionId) {
                        removeFromCollection?.(activeCollectionId, item.id);
                      } else {
                        addToCollection(Number(value), item.id);
                      }

                      event.target.value = "";
                    }}
                    aria-label={`Save ${item.name} to a collection`}
                    title="Save to collection"
                  >
                    <option value="">Save to collection</option>

                    {collections.map(collection => {
                      const alreadySaved =
                        collection.exhibitIds.includes(item.id);

                      return (
                        <option
                          key={collection.id}
                          value={collection.id}
                          disabled={alreadySaved}
                        >
                          {collection.name}
                          {alreadySaved ? " (Saved)" : ""}
                        </option>
                      );
                    })}

                    {activeCollectionId &&
                      removeFromCollection &&
                      isInActiveCollection && (
                        <option value="remove">
                          Remove from this collection
                        </option>
                      )}
                  </select>
                )}

                <button
                  className="view-details-button"
                  onClick={() => openExhibit(item)}
                >
                  Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function RecentSection({ recent, openExhibit }) {
  const recentItems = recent
    .map(id => EXHIBITS.find(item => item.id === id))
    .filter(Boolean);

  if (!recentItems.length) return null;

  return (
    <section className="recent-section">
      <div className="section-heading-row">
        <div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2 className="section-title">Recently viewed</h2></div>
      </div>
      <div className="recent-list">
        {recentItems.map(item => (
          <button className="recent-item" key={item.id} onClick={() => openExhibit(item)}>
            <img src={item.image} alt="" loading="lazy" />
            <span><strong>{item.name}</strong><small>{item.category} · {item.artist}</small></span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon"><Icon size={19} /></span>
      <div><span>{label}</span><strong>{value}</strong></div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon size={25} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && onAction && <button className="primary-button" onClick={onAction}>{action} <ArrowRight size={15} /></button>}
    </div>
  );
}