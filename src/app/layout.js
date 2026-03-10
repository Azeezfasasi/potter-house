import '../globals.css'
import MainHeader from '@/components/home-component/MainHeader'
import Footer from '@/components/home-component/Footer'
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Portal House - Your Gateway to Seamless Solutions',
  description: 'Portal House is your trusted partner for seamless solutions. We provide innovative services to simplify your life and enhance your experience. Join us today and unlock a world of possibilities.',
  icons: {
    icon: '/portalfav.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="w-full site-main-header fixed top-0 z-50">
            <MainHeader />
          </div>
          <main>{children}</main>
          <div className="site-main-header">
            {/* <Footer /> */}
          </div>
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  )
}
