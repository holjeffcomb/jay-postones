import Image from "next/image";

export default function Footer() {
  return (
    <footer className="h-[200px] bg-[var(--primary-color)] text-[var(--text-color)] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <Image
              src="/images/logos/JPDL LOGO 2.0 white.png"
              alt="Logo"
              width={134}
              height={99}
            />
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Sitemap</h3>
            <ul>
              <li>
                <a href="/" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/lessons" className="hover:text-gray-300">
                  Lessons
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="/bug" className="hover:text-gray-300">
                  Report Bug
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Follow Me</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/JayTesseracT/"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <Image
                  src="/images/logos/socials/facebook-neg.png"
                  width={30}
                  height={30}
                  alt="Facebook"
                />
              </a>
              <a
                href="https://www.instagram.com/jaytesseract/"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <Image
                  src="/images/logos/socials/insta-neg.png"
                  width={30}
                  height={30}
                  alt="Instagram"
                />
              </a>
              <a
                href="https://discord.gg/ShRP94FHKQ"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
                title="Discord"
              >
                <Image
                  src="/images/logos/socials/discord-neg.png"
                  width={30}
                  height={30}
                  alt="Discord"
                />
              </a>

              <a
                href="https://www.youtube.com/c/JayPostones"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
                title="Youtube"
              >
                <Image
                  src="/images/logos/socials/youtube-neg.png"
                  width={30}
                  height={30}
                  alt="Youtube"
                />
              </a>
              <a
                href="https://substack.com/@jaypostones"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
                title="Substack"
              >
                <Image
                  src="/images/logos/socials/substack-neg.png"
                  width={23}
                  height={23}
                  alt="Substack"
                />
              </a>
              <a
                href="https://form.jotform.com/230134019743347"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
                title="Rhythm Recap Mailing List"
              >
                <Image
                  src="/images/logos/socials/mail-neg.png"
                  width={30}
                  height={27}
                  alt="Rhythm Recap Mailing List"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Jay Postones. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
