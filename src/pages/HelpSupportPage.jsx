export default function HelpSupportPage() {
  return (
    <div className="max-w-3xl mx-auto py-2 md:py-4 space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-dark-card">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Support Center</p>
        <h1 className="mt-2 text-2xl font-black text-[#0F2854] dark:text-white">Help & Support</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
          Need help with your account, recommendations, or AI tools? Reach out directly.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-dark-card">
        <h2 className="text-lg font-black text-[#0F2854] dark:text-white">Owner Contact</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
         
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-dark-bg">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Brand</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">HorbahsTech</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-dark-bg">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Email</p>
            <a
              href="mailto:horbahstech@gmail.com"
              className="mt-1 inline-block text-sm font-semibold text-[#1C4D8D] hover:underline"
            >
              horbahstech@gmail.com
            </a>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-dark-bg">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Phone</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">08069989705</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">07076098900</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-dark-card">
        <h2 className="text-lg font-black text-[#0F2854] dark:text-white">Quick Help</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li>Use the AI Chatbot for career and skill guidance.</li>
          <li>Use Interview Preparation for role-based practice and feedback.</li>
          <li>Update your profile to improve recommendation quality.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-dark-card">
        <h2 className="text-lg font-black text-[#0F2854] dark:text-white">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              How do I reset my password?
            </summary>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Go to the login page, click on "Forgot Password," and follow the instructions sent to your email.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              How can I improve my recommendations?
            </summary>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Ensure your profile is complete and up-to-date. Engage with the platform regularly to refine your preferences.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              What should I do if I encounter a bug?
            </summary>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Report the issue using the "Contact Support" button or email us directly at horbahstech@gmail.com.
            </p>
          </details>
        </div>
      </div>

      
    </div>
  );
}
