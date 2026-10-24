import React from 'react';
import { X, CheckCircle, Database, Key, Server, Terminal } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseNoticeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Database size={20} color="var(--color-dark-green)" />
            <h3 className="modal-title">Supabase Database & Authentication Setup</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isSupabaseConfigured ? (
            <div className="alert alert-success">
              <CheckCircle size={20} />
              <div>
                <strong>Supabase is Connected & Live!</strong>
                <p style={{ marginTop: 4, fontSize: 13 }}>
                  Your application is actively communicating with your remote PostgreSQL Supabase instance.
                </p>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              <Terminal size={20} />
              <div>
                <strong>Running in Interactive Local Standalone Mode</strong>
                <p style={{ marginTop: 4, fontSize: 13 }}>
                  No remote Supabase credentials detected in <code>.env</code>. All 13 pages, role workflows, and forms are fully functional with local reactive persistence.
                </p>
              </div>
            </div>
          )}

          <h4 style={{ fontSize: 15, marginBottom: 12 }}>3 Steps to Connect Your Supabase PostgreSQL Backend:</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                <Server size={16} />
                <span>Step 1: Create a Free Project</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                Visit <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>, log in, and click <strong>New Project</strong> (e.g. <code>foodbridge-db</code>).
              </p>
            </div>

            <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                <Key size={16} />
                <span>Step 2: Add Environment Variables in <code>.env</code></span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                Copy your Project URL and anon public key from <strong>Project Settings → API</strong> into a <code>.env</code> file:
              </p>
              <pre style={{ background: '#1E293B', color: '#F8FAFC', padding: 10, borderRadius: 6, fontSize: 12, marginTop: 8, overflowX: 'auto' }}>
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
            </div>

            <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                <Database size={16} />
                <span>Step 3: Run Database Schema</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                Open the Supabase <strong>SQL Editor</strong>, open or paste the contents of <code>supabase/schema.sql</code>, and click <strong>Run</strong>.
                This creates the <code>profiles</code>, <code>donations</code>, <code>pickup_requests</code>, and <code>contact_messages</code> tables with RLS and triggers!
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
