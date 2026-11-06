import { useState, useEffect } from 'react';
import universitiesData from './data/universities.json';

// Interfaces
interface HistoricalStats {
  quota: number;
  students: number;
}

interface Department {
  code: string;
  name: string;
  faculty: string;
  degree: string;
  quota_2025: number;
  filled_2025: number;
  male_students: number;
  female_students: number;
  history: {
    [year: string]: HistoricalStats;
  };
}

interface University {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  faculties_count: number;
  departments: Department[];
}

// Turkish-safe lowercase helper function
const trLower = (str: string): string => {
  if (!str) return '';
  return str.replace(/İ/g, 'i').replace(/I/g, 'ı').toLocaleLowerCase('tr-TR');
};

// Department categories mapping for structured filtering
interface DeptCategory {
  id: string;
  label: string;
  keywords?: string[];
}

const DEPT_CATEGORIES: DeptCategory[] = [
  { id: 'all', label: 'Tüm Bölüm Alanları' },
  {
    id: 'muhendislik',
    label: 'Mühendislik & Bilişim',
    keywords: ['mühendis', 'yazılım', 'bilişim', 'yapay zeka', 'bilgisayar', 'elektronik', 'makine', 'endüstri', 'inşaat', 'mekatronik']
  },
  {
    id: 'tip_saglik',
    label: 'Tıp, Diş & Sağlık',
    keywords: ['tıp', 'diş hekim', 'eczacı', 'hemşire', 'fizyoterapi', 'beslenme', 'ebelik', 'sağlık', 'odyoloji', 'çocuk gelişimi', 'veteriner']
  },
  {
    id: 'hukuk',
    label: 'Hukuk & Adalet',
    keywords: ['hukuk', 'adalet']
  },
  {
    id: 'isletme_iktisat',
    label: 'İşletme, İktisat & Finans',
    keywords: ['işletme', 'iktisat', 'ekonomi', 'maliye', 'finans', 'pazarlama', 'muhasebe', 'uluslararası ticaret', 'yönetim bilişim']
  },
  {
    id: 'egitim',
    label: 'Öğretmenlik & Eğitim',
    keywords: ['öğretmen', 'eğitim', 'rehberlik', 'pedagoji']
  },
  {
    id: 'mimarlik_tasarim',
    label: 'Mimarlık & Tasarım',
    keywords: ['mimar', 'tasarım', 'iç mimar', 'peyzaj', 'şehir ve bölge']
  },
  {
    id: 'iletisim',
    label: 'İletişim & Medya',
    keywords: ['iletişim', 'gazeteci', 'halkla ilişkiler', 'radyo', 'televizyon', 'sinema', 'medya', 'reklam']
  },
  {
    id: 'sosyal_psikoloji',
    label: 'Psikoloji & Sosyal Bilimler',
    keywords: ['psikoloji', 'sosyoloji', 'felsefe', 'tarih', 'uluslararası ilişkiler', 'siyaset', 'sosyal hizmet']
  },
  {
    id: 'havacilik',
    label: 'Havacılık & Uzay',
    keywords: ['pilotaj', 'havacılık', 'uçak', 'uzay', 'hava trafik']
  },
  {
    id: 'ilahiyat',
    label: 'İlahiyat & İslami İlimler',
    keywords: ['ilahiyat', 'islami ilim']
  },
  {
    id: 'fen_temel',
    label: 'Temel Bilimler (Fen/Matematik)',
    keywords: ['matematik', 'fizik', 'kimya', 'biyoloji', 'istatistik', 'moleküler biyoloji']
  },
  {
    id: 'guzel_sanatlar',
    label: 'Güzel Sanatlar & Konservatuvar',
    keywords: ['konservatuvar', 'müzik', 'resim', 'tiyatro', 'heykel', 'grafik', 'sahne sanatları', 'gastronomi']
  }
];

// Faculty categories mapping for structured filtering
interface FacultyCategory {
  id: string;
  label: string;
  keywords?: string[];
}

const FACULTY_CATEGORIES: FacultyCategory[] = [
  { id: 'all', label: 'Tüm Fakülte Türleri' },
  { id: 'tip', label: 'Tıp Fakülteleri', keywords: ['tıp'] },
  { id: 'dis', label: 'Diş Hekimliği Fakülteleri', keywords: ['diş'] },
  { id: 'eczacilik', label: 'Eczacılık Fakülteleri', keywords: ['eczac'] },
  { id: 'saglik', label: 'Sağlık Bilimleri Fakülteleri / YO', keywords: ['sağlık'] },
  { id: 'muhendislik', label: 'Mühendislik ve Teknoloji Fakülteleri', keywords: ['mühendis', 'teknoloji', 'bilgisayar ve bilişim'] },
  { id: 'hukuk', label: 'Hukuk Fakülteleri', keywords: ['hukuk'] },
  { id: 'iibf', label: 'İİBF / İşletme / İktisat Fakülteleri', keywords: ['iktisad', 'iktisat', 'işletme', 'siyasal', 'yönetim'] },
  { id: 'egitim', label: 'Eğitim / Eğitim Bilimleri Fakülteleri', keywords: ['eğitim'] },
  { id: 'mimarlik', label: 'Mimarlık ve Tasarım Fakülteleri', keywords: ['mimar', 'tasarım', 'sanat ve tasarım'] },
  { id: 'iletisim', label: 'İletişim Fakülteleri', keywords: ['iletişim'] },
  { id: 'fen_edebiyat', label: 'Fen / Edebiyat / İnsani Bilimler Fakülteleri', keywords: ['fen', 'edebiyat', 'insan ve toplum', 'sosyal ve beşeri'] },
  { id: 'ilahiyat', label: 'İlahiyat / İslami İlimler Fakülteleri', keywords: ['ilahiyat', 'islami'] },
  { id: 'havacilik', label: 'Havacılık ve Uzay Bilimleri', keywords: ['havacılık', 'uzay'] },
  { id: 'guzel_sanatlar', label: 'Güzel Sanatlar / Konservatuvar', keywords: ['güzel sanat', 'konservatuvar'] },
  { id: 'myo', label: 'Meslek Yüksekokulları (MYO)', keywords: ['meslek yüksek', 'myo'] }
];

// City aggregation for dynamic city dropdown
const cityCounts = (universitiesData as University[]).reduce<Record<string, number>>((acc, u) => {
  acc[u.city] = (acc[u.city] || 0) + 1;
  return acc;
}, {});

const allCities = Object.keys(cityCounts).sort((a, b) => a.localeCompare(b, 'tr'));

export default function App() {
  // Theme State (light | dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('whichuni_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('whichuni_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Navigation & View State
  const [viewMode, setViewMode] = useState<'home' | 'details'>('home');
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [activeDeptCode, setActiveDeptCode] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'Devlet', 'Vakıf'
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all', 'Lisans', 'Önlisans'
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedDeptCategory, setSelectedDeptCategory] = useState('all');

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCity !== 'all' ||
    selectedType !== 'all' ||
    selectedLevel !== 'all' ||
    selectedFaculty !== 'all' ||
    selectedDeptCategory !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedType('all');
    setSelectedLevel('all');
    setSelectedFaculty('all');
    setSelectedDeptCategory('all');
  };

  // Filter Pipeline
  const filteredUniversities: University[] = (universitiesData as University[]).map(uni => {
    // 1. Filter by City
    if (selectedCity !== 'all' && uni.city !== selectedCity) {
      return null;
    }

    // 2. Filter by University Type (Devlet/Vakıf)
    if (selectedType !== 'all' && uni.type !== selectedType) {
      return null;
    }

    // 3. Filter Departments inside the university
    const query = trLower(searchTerm.trim());
    const matchedDepts = uni.departments.filter(dept => {
      // Search matching term (university name, department name, faculty, or code)
      const matchesSearch = query === '' ||
        trLower(uni.name).includes(query) ||
        trLower(dept.name).includes(query) ||
        trLower(dept.faculty).includes(query) ||
        dept.code.includes(query);

      // Program Level match
      const matchesLevel = selectedLevel === 'all' || dept.degree === selectedLevel;

      // Faculty cluster match
      let matchesFaculty = true;
      if (selectedFaculty !== 'all') {
        const facCat = FACULTY_CATEGORIES.find(f => f.id === selectedFaculty);
        if (facCat && facCat.keywords) {
          const deptFaculty = trLower(dept.faculty);
          matchesFaculty = facCat.keywords.some(kw => deptFaculty.includes(trLower(kw)));
        }
      }

      // Dept category match
      let matchesCategory = true;
      if (selectedDeptCategory !== 'all') {
        const cat = DEPT_CATEGORIES.find(c => c.id === selectedDeptCategory);
        if (cat && cat.keywords) {
          const deptName = trLower(dept.name);
          matchesCategory = cat.keywords.some(kw => deptName.includes(trLower(kw)));
        }
      }

      return matchesSearch && matchesLevel && matchesFaculty && matchesCategory;
    });

    // Exclude university card if search or department-level filters are active and no depts match
    const hasSearchOrFilters = query !== '' || selectedLevel !== 'all' || selectedFaculty !== 'all' || selectedDeptCategory !== 'all';
    if (hasSearchOrFilters && matchedDepts.length === 0) {
      return null;
    }

    return {
      ...uni,
      departments: matchedDepts
    };
  }).filter((uni): uni is University => uni !== null);

  // Retrieve current active university detail record
  const currentUni = (universitiesData as University[]).find(u => u.id === selectedUniId);

  // Transition to full detailed view page
  const handleViewDetails = (uniId: string) => {
    setSelectedUniId(uniId);
    setViewMode('details');
    setActiveDeptCode(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transition back to main list dashboard page
  const handleBackToHome = () => {
    setViewMode('home');
    setActiveDeptCode(null);
  };

  // Compile calculations for selected university stats charts
  const getUniversityStats = (uni: University) => {
    let totalStudents = 0;
    let totalMale = 0;
    let totalFemale = 0;
    let lisansCount = 0;
    let onlisansCount = 0;

    // Faculty student aggregation
    const facultyMap: { [faculty: string]: number } = {};

    uni.departments.forEach(dept => {
      const studentTotal = dept.male_students + dept.female_students;
      totalStudents += studentTotal;
      totalMale += dept.male_students;
      totalFemale += dept.female_students;

      if (dept.degree === 'Lisans') {
        lisansCount += studentTotal;
      } else {
        onlisansCount += studentTotal;
      }

      facultyMap[dept.faculty] = (facultyMap[dept.faculty] || 0) + studentTotal;
    });

    const malePercent = totalStudents > 0 ? Math.round((totalMale / totalStudents) * 100) : 0;
    const femalePercent = totalStudents > 0 ? Math.round((totalFemale / totalStudents) * 100) : 0;
    const lisansPercent = totalStudents > 0 ? Math.round((lisansCount / totalStudents) * 100) : 0;
    const onlisansPercent = totalStudents > 0 ? Math.round((onlisansCount / totalStudents) * 100) : 0;

    const facultyStats = Object.entries(facultyMap).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);

    return {
      totalStudents,
      totalMale,
      totalFemale,
      malePercent,
      femalePercent,
      lisansCount,
      onlisansCount,
      lisansPercent,
      onlisansPercent,
      facultyStats
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Main Branding Header */}
      <header>
        <div className="header-container">
          <div className="header-left">
            <div className="logo-section" onClick={handleBackToHome} style={{ cursor: 'pointer' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
            <h1>which<span>uni</span></h1>
          </div>
            <div className="tagline">Akademik Tercih ve YÖK Atlas Öğrenci Dağılım İstatistikleri Portalı</div>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Koyu temaya geç' : 'Açık temaya geç'}
            title={theme === 'light' ? 'Koyu temaya geç' : 'Açık temaya geç'}
          >
            {theme === 'light' ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Koyu Tema</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span>Açık Tema</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main page content area */}
      <main style={{ flex: 1 }}>
        {viewMode === 'home' ? (
          /* ViewMode 1: MAIN HOMEPAGE DASHBOARD */
          <>
            {/* Search & Advanced Filters panel */}
            <section className="controls-card">
              <div className="search-wrapper">
                <span className="search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Üniversite adı, bölüm adı veya program kodu arayın (örn: Boğaziçi, Pilotaj, Bilgisayar)..."
                />
              </div>

              {/* Multi-parameter filter options */}
              <div className="filters-wrapper">
                {/* City Filter Dropdown */}
                <div className="filter-group" style={{ minWidth: '180px', flex: '1 1 180px' }}>
                  <span className="filter-label">İl Seçimi</span>
                  <select
                    className="filter-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="all">Tüm İller ({allCities.length} İl / Bölge)</option>
                    {allCities.map(city => (
                      <option key={city} value={city}>
                        {city} ({cityCounts[city]} Üni)
                      </option>
                    ))}
                  </select>
                </div>

                {/* University Type Filter */}
                <div className="filter-group">
                  <span className="filter-label">Üniversite Türü</span>
                  <div className="filter-buttons">
                    <button
                      className={`btn-filter ${selectedType === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedType('all')}
                    >
                      Tümü
                    </button>
                    <button
                      className={`btn-filter ${selectedType === 'Devlet' ? 'active' : ''}`}
                      onClick={() => setSelectedType('Devlet')}
                    >
                      Devlet
                    </button>
                    <button
                      className={`btn-filter ${selectedType === 'Vakıf' ? 'active' : ''}`}
                      onClick={() => setSelectedType('Vakıf')}
                    >
                      Vakıf
                    </button>
                  </div>
                </div>

                {/* Program Level Filter */}
                <div className="filter-group">
                  <span className="filter-label">Program Derecesi</span>
                  <div className="filter-buttons">
                    <button
                      className={`btn-filter ${selectedLevel === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedLevel('all')}
                    >
                      Tümü
                    </button>
                    <button
                      className={`btn-filter ${selectedLevel === 'Lisans' ? 'active' : ''}`}
                      onClick={() => setSelectedLevel('Lisans')}
                    >
                      Lisans
                    </button>
                    <button
                      className={`btn-filter ${selectedLevel === 'Önlisans' ? 'active' : ''}`}
                      onClick={() => setSelectedLevel('Önlisans')}
                    >
                      Önlisans
                    </button>
                  </div>
                </div>

                {/* Advanced Select Filter: Faculty Cluster */}
                <div className="filter-group" style={{ minWidth: '200px', flex: '1 1 200px' }}>
                  <span className="filter-label">Fakülte Türü</span>
                  <select
                    className="filter-select"
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                  >
                    {FACULTY_CATEGORIES.map(fac => (
                      <option key={fac.id} value={fac.id}>{fac.label}</option>
                    ))}
                  </select>
                </div>

                {/* Advanced Select Filter: Department category groups */}
                <div className="filter-group" style={{ minWidth: '200px', flex: '1 1 200px' }}>
                  <span className="filter-label">Bölüm Alanı</span>
                  <select
                    className="filter-select"
                    value={selectedDeptCategory}
                    onChange={(e) => setSelectedDeptCategory(e.target.value)}
                  >
                    {DEPT_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters button if any filter is active */}
                {hasActiveFilters && (
                  <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn-reset-filters"
                      onClick={resetFilters}
                      title="Tüm filtreleri varsayılana sıfırla"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Filtreleri Temizle
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* 3-Column Rectangular University Cards Grid */}
            <section className="unis-grid">
              {filteredUniversities.length === 0 ? (
                <div className="no-results">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '1rem' }}>Filtrelere uygun üniversite bulunamadı.</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Lütfen filtre tercihlerinizi değiştirmeyi veya aramayı genişletmeyi deneyin.</p>
                  {hasActiveFilters && (
                    <button className="btn-back" style={{ margin: '0 auto' }} onClick={resetFilters}>
                      Filtreleri Sıfırla
                    </button>
                  )}
                </div>
              ) : (
                filteredUniversities.map((uni) => (
                  <div
                    key={uni.id}
                    className="uni-card"
                    onClick={() => handleViewDetails(uni.id)}
                  >
                    <div className="card-header">
                      <h3 className="uni-title">{uni.name}</h3>
                      <span className={`badge ${uni.type === 'Devlet' ? 'badge-devlet' : 'badge-vakif'}`}>
                        {uni.type}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <div className="meta-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{uni.city} - {uni.address.split(',')[0]}</span>
                      </div>
                      
                      <div className="meta-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>{uni.phone}</span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <span className="dept-count">{uni.departments.length} Bölüm Listeleniyor</span>
                      <span className="learn-more">
                        Sayfayı Aç
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </section>
          </>
        ) : (
          /* ViewMode 2: FULL DETAILED PROFILE PAGE */
          currentUni && (
            <div className="details-container">
              {/* Top back button */}
              <button className="btn-back" onClick={handleBackToHome}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Panoya Geri Dön
              </button>

              {/* Main Banner section */}
              <section className="profile-banner">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h2 className="profile-title">{currentUni.name}</h2>
                    <span className={`badge ${currentUni.type === 'Devlet' ? 'badge-devlet' : 'badge-vakif'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                      {currentUni.type}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{currentUni.city} / Tercih Merkezi Yerleşkesi</p>
                </div>

                <div className="profile-details-grid">
                  <div className="profile-meta-item">
                    <span className="meta-lbl">Adres</span>
                    <span className="meta-val">{currentUni.address}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="meta-lbl">Telefon</span>
                    <span className="meta-val">{currentUni.phone}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="meta-lbl">Web Sitesi</span>
                    <span className="meta-val">
                      <a href={currentUni.website} target="_blank" rel="noreferrer" className="meta-link">
                        {currentUni.website.replace('https://', '')}
                      </a>
                    </span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="meta-lbl">Fakülte Sayısı</span>
                    <span className="meta-val">{currentUni.faculties_count} Aktif Fakülte</span>
                  </div>
                </div>
              </section>

              {/* Statistics & SVG charts Dashboard */}
              <section className="visual-dashboard-section">
                <h3 className="drawer-section-title" style={{ gridColumn: '1 / -1' }}>Üniversite Genel Dağılım İstatistikleri</h3>
                
                {/* SVG Chart 1: Donut Gender Balance Chart */}
                {(() => {
                  const stats = getUniversityStats(currentUni);
                  
                  // SVG Circle metrics for Donut
                  const radius = 35;
                  const circumference = 2 * Math.PI * radius;
                  const maleOffset = circumference - (stats.malePercent / 100) * circumference;
                  
                  return (
                    <>
                      <div className="chart-card">
                        <h4 className="chart-card-title">Genel Cinsiyet Dağılımı</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                            <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                              {/* Background circle (Female) */}
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="var(--accent-color)" // accent for female
                                strokeWidth="12"
                              />
                              {/* Foreground circle (Male) */}
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="var(--primary-color)" // primary for male
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                strokeDashoffset={maleOffset}
                                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                              />
                            </svg>
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              textAlign: 'center'
                            }}>
                              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                                {stats.totalStudents}
                              </span>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                                Toplam Öğr.
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: 'var(--primary-color)' }}></span>
                              <span>Erkek: {stats.totalMale} (%{stats.malePercent})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: 'var(--accent-color)' }}></span>
                              <span>Kız: {stats.totalFemale} (%{stats.femalePercent})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SVG Chart 2: Horizontal Faculty Distribution Bar Chart */}
                      <div className="chart-card" style={{ gridColumn: 'span 2' }}>
                        <h4 className="chart-card-title">Bölüm/Fakülte Öğrenci Sayıları Dağılımı</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.25rem' }}>
                          {stats.facultyStats.map((fac, idx) => {
                            const maxVal = Math.max(...stats.facultyStats.map(f => f.count));
                            const fillWidth = maxVal > 0 ? (fac.count / maxVal) * 100 : 0;
                            
                            return (
                              <div key={fac.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                                  <span style={{ color: 'var(--primary-color)' }}>{fac.name}</span>
                                  <span style={{ color: 'var(--text-muted)' }}>{fac.count} Öğrenci</span>
                                </div>
                                <div className="visual-bar-container" style={{ height: '14px', backgroundColor: 'var(--bar-bg)' }}>
                                  <div
                                    style={{
                                      width: `${fillWidth}%`,
                                      backgroundColor: idx === 0 ? 'var(--primary-color)' : 'var(--secondary-color)',
                                      height: '100%',
                                      transition: 'width 0.8s ease-out',
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stacked indicator: Lisans vs Önlisans split */}
                      <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                        <h4 className="chart-card-title">Program Seviye Dağılım Oranı (Lisans vs Önlisans)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            <span>Lisans: {stats.lisansCount} Öğrenci (%{stats.lisansPercent})</span>
                            <span>Önlisans: {stats.onlisansCount} Öğrenci (%{stats.onlisansPercent})</span>
                          </div>
                          <div className="visual-bar-container" style={{ height: '24px', backgroundColor: 'var(--bar-bg)', borderRadius: '4px' }}>
                            {stats.lisansPercent > 0 && (
                              <div
                                style={{
                                  width: `${stats.lisansPercent}%`,
                                  backgroundColor: 'var(--devlet-color)',
                                  color: '#ffffff',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'width 0.6s'
                                }}
                              >
                                LİSANS
                              </div>
                            )}
                            {stats.onlisansPercent > 0 && (
                              <div
                                style={{
                                  width: `${stats.onlisansPercent}%`,
                                  backgroundColor: 'var(--primary-color)',
                                  color: '#ffffff',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'width 0.6s'
                                }}
                              >
                                ÖNLİSANS
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </section>

              {/* Grouped departments details Accordion list */}
              <section className="grouped-depts-section">
                <h3 className="drawer-section-title">Akademik Programlar ve Detay İstatistikleri</h3>
                
                {(() => {
                  // Group departments by faculty name dynamically
                  const groups: { [faculty: string]: Department[] } = {};
                  currentUni.departments.forEach(dept => {
                    groups[dept.faculty] = groups[dept.faculty] || [];
                    groups[dept.faculty].push(dept);
                  });

                  if (Object.keys(groups).length === 0) {
                    return (
                      <div className="no-results" style={{ padding: '2rem' }}>
                        Filtre kriterlerinize uyan herhangi bir bölüm listelenemedi.
                      </div>
                    );
                  }

                  return Object.entries(groups).map(([facultyName, depts]) => (
                    <div key={facultyName} className="faculty-group-container">
                      <h4 className="faculty-group-title">{facultyName}</h4>
                      
                      <div className="depts-list">
                        {depts.map(dept => {
                          const totalMale = dept.male_students;
                          const totalFemale = dept.female_students;
                          const totalStudents = totalMale + totalFemale;
                          const malePercent = totalStudents > 0 ? Math.round((totalMale / totalStudents) * 100) : 0;
                          const femalePercent = totalStudents > 0 ? Math.round((totalFemale / totalStudents) * 100) : 0;
                          const quotaOccupancy = dept.quota_2025 > 0 ? Math.round((dept.filled_2025 / dept.quota_2025) * 100) : 0;
                          const isOverfilled = dept.filled_2025 > dept.quota_2025;
                          const isOpen = activeDeptCode === dept.code;

                          return (
                            <div key={dept.code} className={`dept-item ${isOpen ? 'active' : ''}`}>
                              <div
                                className="dept-item-header"
                                onClick={() => setActiveDeptCode(isOpen ? null : dept.code)}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                  <span className="dept-item-title" style={{ fontWeight: 700 }}>{dept.name}</span>
                                  <span style={{ fontSize: '0.75rem', opacity: isOpen ? 0.9 : 0.65 }}>Kod: {dept.code}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                  <span className="badge badge-degree" style={{ fontSize: '0.75rem' }}>{dept.degree}</span>
                                  <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                  </svg>
                                </div>
                              </div>

                              <div className="dept-item-content">
                                {/* Numerical quotas boxes */}
                                <div className="dept-stats-row">
                                  <div className="stat-box">
                                    <div className="stat-value">{dept.filled_2025}</div>
                                    <div className="stat-label">Toplam Yerleşen</div>
                                  </div>
                                  <div className="stat-box">
                                    <div className="stat-value">{dept.quota_2025}</div>
                                    <div className="stat-label">Genel Kontenjan</div>
                                  </div>
                                </div>

                                {/* Gender splits bar */}
                                <div className="ratio-visualizer">
                                  <div className="visual-label">
                                    <span>Cinsiyet Dağılım Oranı</span>
                                    <span>{totalMale} Erkek ({malePercent}%) / {totalFemale} Kız ({femalePercent}%)</span>
                                  </div>
                                  <div className="visual-bar-container" style={{ height: '18px' }}>
                                    {malePercent > 0 && (
                                      <div className="gender-male-fill" style={{ width: `${malePercent}%` }}>
                                        {malePercent >= 15 ? 'Erkek' : ''}
                                      </div>
                                    )}
                                    {femalePercent > 0 && (
                                      <div className="gender-female-fill" style={{ width: `${femalePercent}%` }}>
                                        {femalePercent >= 15 ? 'Kız' : ''}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Quota occupancy progress bar */}
                                <div className="ratio-visualizer">
                                  <div className="visual-label">
                                    <span>Kontenjan Doluluk İndikatörü</span>
                                    <span>%{quotaOccupancy} doluluk ({dept.filled_2025}/{dept.quota_2025})</span>
                                  </div>
                                  <div className="visual-bar-container" style={{ height: '18px' }}>
                                    <div
                                      className={`quota-fill-bar ${isOverfilled ? 'overfilled' : ''}`}
                                      style={{ width: `${Math.min(quotaOccupancy, 100)}%` }}
                                    >
                                      %{quotaOccupancy}
                                    </div>
                                  </div>
                                </div>

                                {/* Historical quota comparison data */}
                                <div>
                                  <div className="visual-label" style={{ marginBottom: '0.25rem' }}>
                                    <span>Son 3 Yılın Karşılaştırmalı YÖK Atlas Verileri</span>
                                  </div>
                                  <table className="history-table">
                                    <thead>
                                      <tr>
                                        <th>Yıl</th>
                                        <th>Kontenjan</th>
                                        <th>Yerleşen</th>
                                        <th>Doluluk Oranı</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(dept.history)
                                        .sort((a, b) => Number(b[0]) - Number(a[0]))
                                        .map(([year, stats]) => {
                                          const yearlyOccupancy = stats.quota > 0 ? Math.round((stats.students / stats.quota) * 100) : 0;
                                          return (
                                            <tr key={year}>
                                              <td style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{year}</td>
                                              <td>{stats.quota}</td>
                                              <td>{stats.students}</td>
                                              <td style={{ fontWeight: 600 }}>%{yearlyOccupancy}</td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </section>
            </div>
          )
        )}
      </main>
    </div>
  );
}
