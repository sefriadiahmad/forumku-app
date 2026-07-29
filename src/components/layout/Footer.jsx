// Footer Component - Application footer
// ForumKu Layout Component
import { Link } from 'react-router-dom'
import { MessageSquare, Heart } from 'lucide-react'
import { clsx } from 'clsx'

const Footer = ({ className, ...props }) => {
  const currentYear = new Date().getFullYear()

  // Footer links
  const footerLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/leaderboard', label: 'Peringkat' },
  ]

  // Social links
  const socialLinks = [
    { href: 'https://github.com/sefriadiahmad', label: 'GitHub', icon: '/src/assets/github.png' },
    { href: 'https://linkedin.com/in/sefriadiahmad', label: 'LinkedIn', icon: '/src/assets/linkedin.png' },
  ]

  return (
    <footer
      className={clsx(
        'mt-auto border-t border-border bg-surface',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">
                ForumKu
              </span>
            </Link>
            <p className="text-text-secondary text-sm">
              Platform diskusi interaktif untuk berbagi ide dan opinion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Navigasi</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Copyright */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Ikuti Kami</h3>
            <div className="flex items-center gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-surface-secondary text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <img src={social.icon} alt={social.label} className="w-7 h-7" />
                </a>
              ))}
            </div>
            <p className="text-text-tertiary text-xs">
              Made with <Heart className="w-3 h-3 inline text-error" /> in Indonesia
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-text-tertiary text-sm">
            © {currentYear} ForumKu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
