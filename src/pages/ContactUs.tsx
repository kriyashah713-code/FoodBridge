import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sendContactMessage } from '../services/api';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What types of food can donors list on FoodBridge?',
      a: 'Donors can list clean cooked meals (packaged in food-grade containers), raw grains, sealed bakery items, fresh fruits & vegetables, and dairy products. All items must have an accurate preparation timestamp and strict safe pickup deadline.'
    },
    {
      q: 'How are partner NGOs verified?',
      a: 'Organizations registering as NGOs must provide their registration details and physical distribution address. Administrators review submissions to ensure meals are distributed only to registered community shelters and beneficiaries.'
    },
    {
      q: 'What happens when a donation reaches its Safe Pickup Deadline?',
      a: 'Our database and application automatically update the listing status to "Expired". No NGO can submit requests for expired food, maintaining strict adherence to public food safety standards.'
    },
    {
      q: 'Is there any fee or commission for using FoodBridge?',
      a: 'None! FoodBridge is an open humanitarian web engineering project. Listing surplus and requesting collections is 100% free for all registered donors and charity partners.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await sendContactMessage({
        name,
        email,
        subject,
        message
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to deliver message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-spacer">
      <div className="container">
        {/* Page Title */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <span className="badge badge-mint" style={{ marginBottom: 8 }}>Get in Touch</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Contact & Support</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>
            Have questions about onboarding your organization, food safety protocols, or technical integration? Reach out to our team.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, marginBottom: 56 }}>
          {/* Contact Form Card */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <Mail size={18} color="var(--color-dark-green)" />
                <h3 className="modal-title">Send Us a Message</h3>
              </div>
              <span className="badge badge-mint">Active Support</span>
            </div>

            <div className="card-body">
              {success && (
                <div className="alert alert-success">
                  <CheckCircle2 size={18} />
                  <span>Your inquiry has been logged! Our team will respond to your email shortly.</span>
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ananya Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-input"
                      placeholder="ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">
                    Subject / Topic *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Partnering as Caterer in Pune"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="msg">
                    Message Content *
                  </label>
                  <textarea
                    id="msg"
                    className="form-textarea"
                    rows={4}
                    placeholder="Describe how we can support your donation logistics or platform inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submitting}
                >
                  <Send size={15} />
                  <span>{submitting ? 'Submitting Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Details Card */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3 className="modal-title">Engineering Project Office</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="flex items-start gap-3">
                    <MapPin size={20} color="var(--color-dark-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Department of Computer Engineering</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                        Engineering Campus Tech Complex, University Road, Maharashtra, India
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={20} color="var(--color-dark-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Direct Project Email</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <a href="mailto:support@foodbridge.org">support@foodbridge.org</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={20} color="var(--color-dark-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Helpline / Coordinator</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                        +91 98765 43210 (Mon–Sat, 8 AM – 8 PM)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={20} color="var(--color-dark-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Donation Window Support</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                        Surplus listings accepted 24/7 with automated safe deadline monitoring.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Card */}
            <div className="card" style={{ backgroundColor: 'var(--color-peach-light)', border: '1px solid var(--color-peach)' }}>
              <div className="card-body">
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-peach-dark)', marginBottom: 6 }}>
                  Emergency Food Surplus?
                </h4>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  If you have a large banquet event with more than 100 surplus servings expiring today, please list it directly on the <strong>Donate Food</strong> page for immediate NGO broadcast.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Common queries from food donors and NGO pickup coordinators</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="card">
                  <div
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 15,
                      color: isOpen ? 'var(--color-dark-green)' : 'var(--color-text-main)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--color-border-subtle)' }}>
                      <p style={{ marginTop: 12 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
