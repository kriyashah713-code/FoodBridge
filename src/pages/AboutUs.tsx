import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Target,
  Leaf,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div>
      {/* Hero Header */}
      <section style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 760 }}>
          <span className="badge badge-mint" style={{ marginBottom: 12 }}>
            Engineering for Social Impact
          </span>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            About FoodBridge
          </h1>
          <p style={{ fontSize: 17, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            A full-stack food waste reduction and donation routing system developed to turn surplus commercial and banquet food into community sustenance.
          </p>
        </div>
      </section>

      {/* The Core Challenge & Our Mission */}
      <section className="section-spacer">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <span className="badge badge-peach" style={{ marginBottom: 12 }}>The Problem We Solve</span>
              <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
                Paradox of Plenty: Millions Hungry While Fresh Food is Discarded
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 16 }}>
                Every day, catering services, marriage halls, restaurants, and supermarkets generate tonnes of high-quality, perfectly edible cooked and raw food that goes directly into landfills due to a lack of immediate coordination channels.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                Concurrently, hundreds of community shelters, orphanages, and night shelter kitchens struggle with daily ingredient costs. <strong>FoodBridge</strong> acts as a real-time, authenticated logistics bridge connecting food donors with verified local NGOs within safe consumption windows.
              </p>

              <div className="grid grid-2" style={{ gap: 16 }}>
                <div style={{ padding: 14, backgroundColor: 'var(--color-mint-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-mint)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: 4 }}>40% Food Wasted</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Estimated harvest-to-plate waste across urban food chains.</div>
                </div>

                <div style={{ padding: 14, backgroundColor: 'var(--color-peach-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-peach)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-peach-dark)', marginBottom: 4 }}>Zero Direct Cost</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Food is donated 100% free of charge to verified humanitarian shelters.</div>
                </div>
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: 24, backgroundColor: '#FFFFFF', border: '2px solid var(--color-mint)' }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-mint)',
                  color: 'var(--color-dark-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Target size={26} />
                </div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Our 3 Pillars of Impact</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, color: 'var(--color-text-muted)' }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} color="var(--color-dark-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>Real-time Expiry Tracking:</strong> Strict safe pickup windows prevent spoiled food distribution.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} color="var(--color-dark-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>Mutual Accountability:</strong> Both donors and NGOs manage requests with full contact transparency upon approval.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} color="var(--color-dark-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>Environmental Reduction:</strong> Minimizes methane emissions generated by decomposing organic landfill waste.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UN Sustainable Development Goals Alignment */}
      <section className="section-spacer" style={{ backgroundColor: 'var(--color-white)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <span className="badge badge-lavender" style={{ marginBottom: 8 }}>Global Goals</span>
            <h2 className="section-title">United Nations SDG Alignment</h2>
            <p className="section-subtitle">
              FoodBridge is engineered in direct support of the United Nations 2030 Sustainable Development Agenda.
            </p>
          </div>

          <div className="grid grid-2">
            <div className="card" style={{ borderLeft: '6px solid var(--color-dark-green)' }}>
              <div className="card-body">
                <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-dark-green)', fontWeight: 800 }}>
                    SDG 2
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18 }}>Zero Hunger</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Target 2.1 & 2.2</span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Directing surplus nutrient-rich cooked meals and produce to community shelters ensures regular, healthy food access for vulnerable populations.
                </p>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '6px solid var(--color-peach-dark)' }}>
              <div className="card-body">
                <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-peach-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-peach-dark)', fontWeight: 800 }}>
                    SDG 12
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18 }}>Responsible Consumption & Production</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Target 12.3 (Halve Per Capita Food Waste)</span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  By empowering commercial caterers and retailers to redistribute unsold inventory, FoodBridge reduces municipal food waste at the source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Project Credits */}
      <section className="section-spacer">
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="card" style={{ backgroundColor: 'var(--color-mint-light)', border: '2px solid var(--color-mint)' }}>
            <div className="card-body" style={{ padding: 32 }}>
              <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-dark-green)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: 20, color: 'var(--color-dark-green)' }}>Academic Capstone Engineering Project</h3>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    B.Tech Computer Engineering (Third Year) • Web & Database Engineering
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'var(--color-text-main)', lineHeight: 1.7, marginBottom: 16 }}>
                This project was created as a complete full-stack web application demonstrating:
              </p>

              <div className="grid grid-2" style={{ gap: 12, marginBottom: 24, fontSize: 13 }}>
                <div style={{ background: '#FFFFFF', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                  <strong>Frontend Architecture:</strong> React 18, TypeScript, Vite, React Router 6, Responsive Custom CSS
                </div>
                <div style={{ background: '#FFFFFF', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                  <strong>Backend & Database:</strong> Supabase PostgreSQL, Row-Level Security (RLS) Policies, Auth Triggers
                </div>
                <div style={{ background: '#FFFFFF', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                  <strong>Role-Based Access Control:</strong> Distinct workflows for Donors, NGOs, and Administrators
                </div>
                <div style={{ background: '#FFFFFF', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                  <strong>Food Safety Protocol:</strong> Preparation timestamps, safe consumption windows, automated expiration
                </div>
              </div>

              <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-mint)', paddingTop: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--color-dark-green)', fontWeight: 600 }}>
                  Ready to test the application workflow?
                </span>
                <Link to="/available-food" className="btn btn-primary btn-sm">
                  <span>Browse Available Food</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
