import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import MainHeader from "@/widgets/MainHeader";
import MainFooter from "@/widgets/MainFooter";
import GlobalContextProvider from "@/components/GlobalContextProvider";
import TailoredServiceBanner from "@/widgets/TailoredServiceBanner";

interface TocPreview {
  title: string;
  path: string;
  image: string;
  status: { desktop: string; responsive: string };
  description: string;
}

const TOCPage = () => {
  const getStatusColor = (status: string) => {
    if (status === "completed") {
      return "bg-green-700";
    } else if (status === "in-progress") {
      return "bg-yellow-500";
    } else {
      return "bg-red-600";
    }
  };

  return (
    <GlobalContextProvider>
      <MainHeader />
      <section className="bg-gradient-to-br from-yellow-50 to-gray-100 lg:pt-12 lg:pb-32 pt-8 pb-16">
        <Container>
          <div className="mt-[122.6px]">
            <h1 className="md:text-6xl text-5xl font-bold text-primary md:mb-16 mb-12 tracking-wide text-center">
              TOC
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tocPreviews.map((item: TocPreview) => (
                <div
                  key={item.path}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col hover:scale-[1.02] will-change-transform transition-transform duration-200"
                >
                  <div className="aspect-video relative bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title + " preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-yellow-700 mb-2">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 mb-4 text-sm">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-4">
                        <span
                          className={`flex items-center gap-2 rounded-full text-sm font-medium`}
                        >
                          <span
                            className={`${getStatusColor(
                              item.status.desktop
                            )} rounded-full size-3`}
                          ></span>
                          <span>Desktop</span>
                        </span>
                        <span
                          className={`flex items-center gap-2 rounded-full text-sm font-medium`}
                        >
                          <span
                            className={`${getStatusColor(
                              item.status.responsive
                            )} rounded-full size-3`}
                          ></span>
                          <span>Responsive</span>
                        </span>
                      </div>
                      <Link
                        href={item.path}
                        className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full shadow hover:bg-yellow-600 transition-colors"
                        aria-label={`Go to ${item.title}`}
                        target="_blank"
                      >
                        <svg
                          width="21"
                          height="14"
                          viewBox="0 0 21 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.2031 1.23145L19.5605 6.58932C19.7558 6.78458 19.7558 7.10115 19.5605 7.29641L14.2031 12.6538"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M19.7383 6.91406H0.484375"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <TailoredServiceBanner />
      <MainFooter />
    </GlobalContextProvider>
  );
};

export default TOCPage;

const tocPreviews: TocPreview[] = [
  {
    title: "Home",
    path: "/",
    image: "/images/banner-image.webp",
    status: { desktop: "completed", responsive: "completed" },
    description: "Welcome to our homepage! Discover what we do.",
  },
  {
    title: "About Us",
    path: "/about",
    image: "/images/about-banner.svg",
    status: { desktop: "completed", responsive: "pending" },
    description: "Learn more about our story, values, and team.",
  },
  {
    title: "Works",
    path: "/works",
    image: "/images/work-1.webp",
    status: { desktop: "completed", responsive: "completed" },
    description: "Explore our portfolio and recent projects.",
  },
  {
    title: "Careers",
    path: "/careers",
    image: "/images/careers-banner.webp",
    status: { desktop: "completed", responsive: "in-progress" },
    description: "Join our team and explore career opportunities.",
  },
  {
    title: "Contact Us",
    path: "/contact-us",
    image: "/images/contact-banner.svg",
    status: { desktop: "completed", responsive: "completed" },
    description: "Get in touch with us for inquiries or support.",
  },
];
