import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok, FaTelegramPlane } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#11181d] text-white mt-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          
          {/* Brand */}
          <div className="flex items-center justify-center md:justify-start">
            <Image
              src="/images/logo/logo.png"
              alt="VD7 News"
              width={140}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">ទំនាក់ទំនងមកយើង</h3>

            <div className="space-y-4 text-sm text-gray-200">
              <p>
                <span className="font-semibold">ទូរស័ព្ទ:</span> 016697766
              </p>
              <p>
                <span className="font-semibold">អ៊ីមែល:</span> vd7.cloud.com
              </p>
              <p>
                <span className="font-semibold">អាសយដ្ឋាន:</span> សង្កាត់៣
                ក្រុង/ខេត្តព្រះសីហនុ
              </p>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">តាមដានយើង</h3>

            <div className="flex flex-wrap justify-center md:justify-start gap-7">

              <a
                href="https://www.facebook.com/share/1KTQUvtcJV/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg hover:scale-105 transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.youtube.com/@vd7newstv540"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-lg hover:scale-105 transition"
              >
                <FaYoutube />
              </a>

              <a
                href="http://www.tiktok.com/@vd7news"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-lg hover:scale-105 transition"
              >
                <FaTiktok />
              </a>

              <a
                href="https://t.me/vd7newsdaily"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-lg hover:scale-105 transition"
              >
                <FaTelegramPlane />
              </a>

            </div>

            <p className="text-sm text-gray-400 mt-4 leading-6 max-w-sm">
              អាចតាមដានព័ត៌មានថ្មីៗ និងព្រឹត្តិការណ៍សំខាន់ៗរបស់យើងតាមបណ្ដាញសង្គម។
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-4 text-sm text-gray-400 text-center">
          <p>© 2026 VD7 News. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
        </div>
      </div>
    </footer>
  );
}