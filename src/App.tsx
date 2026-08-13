import { useState } from 'react';
import universitiesData from './data/universities.json';

// Interfaces for structured types
interface HistoricalStats {
  quota: number;
  students: number;
}

interface Department {
  code: string;
  name: string;
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
  address: string;
  phone: string;
  website: string;
  faculties_count: number;
  departments: Department[];
}

export default function App() {
  // App States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'Devlet', 'Vakıf'
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all', 'Lisans', 'Önlisans'
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [activeDeptCode, setActiveDeptCode] = useState<string | null>(null);

  // Filter Pipeline
  const filteredUniversities: University[] = (universitiesData as University[]).map(uni => {
    // 1. Filter by University Type
    if (selectedType !== 'all' && uni.type !== selectedType) {
      return null;
    }

    // 2. Filter Departments by search and degree level
    const query = searchTerm.toLowerCase().trim();
    const matchedDepts = uni.departments.filter(dept => {
      const matchesSearch = query === '' ||
        uni.name.toLowerCase().includes(query) ||
        dept.name.toLowerCase().includes(query) ||
        dept.code.includes(query);

      const matchesLevel = selectedLevel === 'all' || dept.degree === selectedLevel;

      return matchesSearch && matchesLevel;
    });

    // 3. Exclude university if search query is active but no departments match
    if (query !== '' && matchedDepts.length === 0) {
      return null;
    }

    return {
      ...uni,
      departments: matchedDepts
    };
  }).filter((uni): uni is University => uni !== null);

  const selectedUni = filteredUniversities.find(u => u.id === selectedUniId);

  // Close drawer helper
  const handleCloseDrawer = () => {
    setSelectedUniId(null);
    setActiveDeptCode(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header>
        <div className="header-container">
          <div className="logo-section">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
            <h1>which<span>uni</span></h1>
          </div>
          <div className="tagline">İstanbul Üniversiteleri YÖK Atlas Öğrenci ve Bölüm İstatistikleri Portalı</div>
        </div>
      </header>

      {/* Main Dashboard area */}
      <main>
        
        {/* Search & Filters Controls */}
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
              placeholder="Üniversite adı veya bölüm adı arayın (örn: Bilgisayar, İTÜ, Tıp)..."
            />
          </div>

          <div className="filters-wrapper">
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

            <div className="filter-group">
              <span className="filter-label">Program Seviyesi</span>
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
                  Lisans (4 Yıllık)
                </button>
                <button
                  className={`btn-filter ${selectedLevel === 'Önlisans' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('Önlisans')}
                >
                  Önlisans (2 Yıllık)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* University Grid Feed */}
        <section className="unis-grid">
          {filteredUniversities.length === 0 ? (
            <div className="no-results">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>Arama kriterlerine uygun üniversite bulunamadı.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Lütfen farklı anahtar kelimeler veya filtreler deneyin.</p>
            </div>
          ) : (
            filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                className="uni-card"
                onClick={() => setSelectedUniId(uni.id)}
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
                    <span>{uni.address}</span>
                  </div>
                  
                  <div className="meta-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{uni.phone}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="dept-count">{uni.departments.length} Bölüm Eşleşti</span>
                  <span className="learn-more">
                    İncele
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
      </main>

      {/* Slide-in Details Drawer */}
      <div
        className={`drawer-overlay ${selectedUniId ? 'active' : ''}`}
        onClick={handleCloseDrawer}
      ></div>

      <div className={`drawer ${selectedUniId ? 'active' : ''}`}>
        {selectedUni && (
          <>
            <div className="drawer-header">
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.4rem', fontWeight: 800 }}>
                  {selectedUni.name}
                </h2>
                <span className={`badge ${selectedUni.type === 'Devlet' ? 'badge-devlet' : 'badge-vakif'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                  {selectedUni.type}
                </span>
              </div>
              <button className="drawer-close" onClick={handleCloseDrawer}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="drawer-content">
              {/* General Contact Info */}
              <div>
                <h3 className="drawer-section-title">Genel Bilgiler</h3>
                <div className="drawer-info-grid">
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="info-label">Adres:</span>
                    <span className="info-value">{selectedUni.address}</span>
                  </div>
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="info-label">Telefon:</span>
                    <span className="info-value">{selectedUni.phone}</span>
                  </div>
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span className="info-label">Web Sitesi:</span>
                    <span className="info-value">
                      <a href={selectedUni.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none' }}>
                        {selectedUni.website.replace('https://', '')}
                      </a>
                    </span>
                  </div>
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="info-label">Fakülte:</span>
                    <span className="info-value">{selectedUni.faculties_count} Fakülte</span>
                  </div>
                </div>
              </div>

              {/* Department Statistics Expandable Accordions */}
              <div>
                <h3 className="drawer-section-title">Bölümler ({selectedUni.departments.length})</h3>
                <div className="depts-list">
                  {selectedUni.departments.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      Kriterlere uygun bölüm bulunamadı.
                    </div>
                  ) : (
                    selectedUni.departments.map((dept) => {
                      const totalMale = dept.male_students;
                      const totalFemale = dept.female_students;
                      const totalStudents = totalMale + totalFemale;
                      const malePercent = totalStudents > 0 ? Math.round((totalMale / totalStudents) * 100) : 0;
                      const femalePercent = totalStudents > 0 ? Math.round((totalFemale / totalStudents) * 100) : 0;
                      const quotaOccupancy = dept.quota_2025 > 0 ? Math.round((dept.filled_2025 / dept.quota_2025) * 100) : 0;
                      const isOverfilled = dept.filled_2025 > dept.quota_2025;
                      const isOpen = activeDeptCode === dept.code;

                      return (
                        <div
                          key={dept.code}
                          className={`dept-item ${isOpen ? 'active' : ''}`}
                        >
                          <div
                            className="dept-item-header"
                            onClick={() => setActiveDeptCode(isOpen ? null : dept.code)}
                          >
                            <span className="dept-item-title">{dept.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                              <span className="badge badge-degree">{dept.degree}</span>
                              <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                          </div>

                          <div className="dept-item-content">
                            {/* Stats numbers */}
                            <div className="dept-stats-row">
                              <div className="stat-box">
                                <div className="stat-value">{dept.filled_2025}</div>
                                <div className="stat-label">Toplam Yerleşen</div>
                              </div>
                              <div className="stat-box">
                                <div className="stat-value">{dept.quota_2025}</div>
                                <div className="stat-label">Kontenjan</div>
                              </div>
                            </div>

                            {/* Gender split visualizer */}
                            <div className="ratio-visualizer">
                              <div className="visual-label">
                                <span>Cinsiyet Dağılımı</span>
                                <span>{totalMale} Erkek ({malePercent}%) / {totalFemale} Kız ({femalePercent}%)</span>
                              </div>
                              <div className="visual-bar-container">
                                <div className="gender-male-fill" style={{ width: `${malePercent}%` }}>
                                  {malePercent >= 15 ? 'Erkek' : ''}
                                </div>
                                <div className="gender-female-fill" style={{ width: `${femalePercent}%` }}>
                                  {femalePercent >= 15 ? 'Kız' : ''}
                                </div>
                              </div>
                            </div>

                            {/* Quota Progress */}
                            <div className="ratio-visualizer">
                              <div className="visual-label">
                                <span>Kontenjan Doluluk Oranı</span>
                                <span>%{quotaOccupancy} doluluk ({dept.filled_2025}/{dept.quota_2025})</span>
                              </div>
                              <div className="visual-bar-container">
                                <div
                                  className={`quota-fill-bar ${isOverfilled ? 'overfilled' : ''}`}
                                  style={{ width: `${Math.min(quotaOccupancy, 100)}%` }}
                                >
                                  %{quotaOccupancy}
                                </div>
                              </div>
                            </div>

                            {/* 3 Years Historical comparison table */}
                            <div>
                              <div className="visual-label" style={{ marginBottom: '0.25rem' }}>
                                <span>Son 3 Yılın İstatistikleri</span>
                              </div>
                              <table className="history-table">
                                <thead>
                                  <tr>
                                    <th>Yıl</th>
                                    <th>Kontenjan</th>
                                    <th>Yerleşen</th>
                                    <th>Doluluk</th>
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
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
