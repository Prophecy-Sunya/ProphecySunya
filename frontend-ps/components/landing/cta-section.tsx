import { ArrowRightIcon, BoltIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 relative">
      {/* Background decoration */}
      {/* <div className="absolute inset-0 -z-10 border">
        <div className="absolute top-0 right-0 w-1/3 h-full  rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full  rounded-full blur-[150px]" />
      </div> */}

      {/* <Container> */}
      <div className="bg-gradient-to-r from-default-50/70 to-transparent border border-default/50 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/5 rounded-full -translate-x-1/2 translate-y-1/2 " />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Predicting?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already using our platform to make
            smarter predictions and earn rewards based on their knowledge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" color="primary" variant="shadow">
              Launch App{" "}
              <BoltIcon className="ml-2 h-4 w-4 group-hover:animate-pulse" />
            </Button>
            <Button
              variant="bordered"
              size="lg"
              className="w-full sm:w-auto group"
            >
              Learn More{" "}
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M15 9L9.5 14.5L8 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Audited Security</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M15 9L9.5 14.5L8 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>$1.2M Liquidity</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M15 9L9.5 14.5L8 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
      {/* </Container> */}
    </section>
  );
}
