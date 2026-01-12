import React from "react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PrivacyPageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  // Handle both Promise and direct params (Next.js 15 compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  const locale = resolvedParams.locale || "en";
  const isRTL = locale === "ar";
  const brandName = locale === "ar" ? "روشن ريت" : "Roshn REIT";

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"} 
      lang={locale}
      className="min-h-screen bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
          <p className="text-lg text-gray-600">
            {isRTL 
              ? "آخر تحديث: يناير 2025" 
              : "Last Updated: January 2025"}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg mx-auto max-w-none space-y-8">
          {/* Section 1: Introduction / Statement of Commitment */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "1. المقدمة / الالتزام" : "1. Introduction / Statement of Commitment"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? `نحن في ${brandName} نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا للمعلومات عند زيارتك لموقعنا الإلكتروني أو استخدامك لخدماتنا. باستخدامك لموقعنا، فإنك توافق على الممارسات الموضحة في هذه السياسة.`
                  : `At ${brandName}, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard the information you provide to us when visiting our website or using our services. By using our website, you agree to the practices described in this policy.`}
              </p>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "2. المعلومات التي نجمعها" : "2. Information We Collect"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? "قد نقوم بجمع وتخزين واستخدام المعلومات التالية:"
                  : "We may collect, store, and use the following types of personal information:"}
              </p>
              <ul className="list-disc space-y-2 pr-6 pl-6">
                {isRTL ? (
                  <>
                    <li>معلومات عن جهازك ونشاط التصفح (عنوان IP، الموقع الجغرافي، نوع وإصدار المتصفح، نظام التشغيل).</li>
                    <li>تفاصيل عن زيارتك للموقع (مصدر الإحالة، مدة الزيارة، الصفحات التي تتصفحها).</li>
                    <li>المعلومات التي تقدمها عند التسجيل (مثل الاسم والبريد الإلكتروني ورقم الهاتف).</li>
                    <li>المعلومات المتعلقة بالاستفسارات أو النماذج العقارية أو الخدمات.</li>
                    <li>تفاصيل المعاملات (الاسم، العنوان، البريد الإلكتروني، الهاتف، بيانات الدفع).</li>
                    <li>أي بيانات شخصية أخرى تقدمها لنا طوعاً.</li>
                  </>
                ) : (
                  <>
                    <li>Device and browsing information (IP address, location, browser type/version, operating system).</li>
                    <li>Details about visits to our site (referral source, duration, pages viewed).</li>
                    <li>Information provided during registration (name, email, phone).</li>
                    <li>Data entered when using our services (inquiries, property interest forms, bookings).</li>
                    <li>Transaction details (name, address, email, phone, payment details).</li>
                    <li>Any other personal information voluntarily provided.</li>
                  </>
                )}
              </ul>
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "3. كيفية استخدام المعلومات" : "3. How We Use Your Information"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? "نستخدم بياناتك الشخصية للأغراض التالية:"
                  : "We use personal data for the following purposes:"}
              </p>
              <ul className="list-disc space-y-2 pr-6 pl-6">
                {isRTL ? (
                  <>
                    <li>تشغيل وإدارة موقعنا وخدماتنا.</li>
                    <li>تخصيص تجربتك على الموقع.</li>
                    <li>تمكينك من استخدام خدماتنا المتاحة.</li>
                    <li>معالجة المعاملات وتسليم الخدمات.</li>
                    <li>إرسال الفواتير وإشعارات الدفع وتحصيل المبالغ.</li>
                    <li>الرد على استفساراتك أو شكاويك.</li>
                    <li>حماية الموقع من الاحتيال وضمان أمنه.</li>
                    <li>تقديم إحصائيات عامة (غير محددة الهوية) لأطراف ثالثة.</li>
                    <li>إرسال عروض أو تواصل تسويقي بموافقتك.</li>
                  </>
                ) : (
                  <>
                    <li>Operating and managing our website and services.</li>
                    <li>Customizing your browsing experience.</li>
                    <li>Enabling you to use available services.</li>
                    <li>Processing transactions and delivering services.</li>
                    <li>Sending invoices, reminders, and collecting payments.</li>
                    <li>Responding to your inquiries or complaints.</li>
                    <li>Protecting against fraud and maintaining security.</li>
                    <li>Providing aggregated, non-identifiable statistics to third parties.</li>
                    <li>Sending marketing communications with your consent.</li>
                  </>
                )}
              </ul>
            </div>
          </section>

          {/* Section 4: Data Sharing & Disclosure */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "4. مشاركة وكشف المعلومات" : "4. Data Sharing & Disclosure"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? "قد نفصح عن بياناتك الشخصية:"
                  : "We may disclose personal data:"}
              </p>
              <ul className="list-disc space-y-2 pr-6 pl-6">
                {isRTL ? (
                  <>
                    <li>لموظفينا أو وكلائنا أو مستشارينا أو مزودي الخدمات حسب الحاجة.</li>
                    <li>إذا طلب القانون أو الجهات التنظيمية ذلك.</li>
                    <li>للمشتري أو المحتمل في حال بيع أو دمج أعمالنا.</li>
                  </>
                ) : (
                  <>
                    <li>To our employees, agents, advisors, or service providers as reasonably required.</li>
                    <li>When required by law or regulatory authorities.</li>
                    <li>To a buyer or potential buyer in the case of a business sale or merger.</li>
                  </>
                )}
              </ul>
              <p>
                {isRTL 
                  ? "وباستثناء ما سبق، لن نشارك بياناتك مع أطراف ثالثة لأغراض تسويقية بدون موافقتك الصريحة."
                  : "Except as described above, we will not share your personal data with third parties for marketing purposes without your explicit consent."}
              </p>
            </div>
          </section>

          {/* Section 5: Cookies & Tracking */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "5. ملفات تعريف الارتباط" : "5. Cookies & Tracking"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? "يستخدم موقعنا ملفات تعريف الارتباط (Cookies) وتقنيات تتبع مثل Google Analytics وMeta Pixel لتحسين تجربتك وتحليل حركة المرور. يمكنك تعطيلها من إعدادات المتصفح، لكن قد يؤثر ذلك على بعض وظائف الموقع."
                  : "Our website uses cookies and tracking tools (such as Google Analytics, Meta Pixel) to improve your experience and analyze traffic. You may disable cookies in your browser, but some features may not work properly."}
              </p>
            </div>
          </section>

          {/* Section 6: User Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "6. حقوق المستخدم" : "6. User Rights"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? "يحق لك:"
                  : "You have the right to:"}
              </p>
              <ul className="list-disc space-y-2 pr-6 pl-6">
                {isRTL ? (
                  <>
                    <li>طلب الوصول إلى بياناتك الشخصية.</li>
                    <li>تصحيح أو تحديث بياناتك إذا كانت غير دقيقة.</li>
                    <li>طلب حذف بياناتك الشخصية وفقاً للأنظمة.</li>
                    <li>سحب موافقتك على المعالجة في أي وقت.</li>
                  </>
                ) : (
                  <>
                    <li>Request access to your personal data.</li>
                    <li>Request corrections or updates if inaccurate.</li>
                    <li>Request deletion of your data, subject to legal obligations.</li>
                    <li>Withdraw consent for processing at any time.</li>
                  </>
                )}
              </ul>
            </div>
          </section>

          {/* Section 7: Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "7. أمن البيانات" : "7. Data Security"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? "نتخذ التدابير التقنية والتنظيمية المناسبة لحماية بياناتك (تشفير، خوادم آمنة، وصول محدود). جميع المعاملات المالية محمية بتقنية التشفير."
                  : "We implement reasonable technical and organizational measures to secure your data (encryption, secure servers, limited access). All financial transactions are encrypted."}
              </p>
            </div>
          </section>

          {/* Section 8: Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#D35400]">
              {isRTL ? "8. خصوصية الأطفال" : "8. Children's Privacy"}
            </h2>
            <div className="space-y-3 text-gray-700 leading-7">
              <p>
                {isRTL 
                  ? "خدماتنا غير موجهة للأطفال دون سن 16 عاماً، ولا نقوم عمداً بجمع بيانات شخصية عنهم. إذا تبين لنا أننا جمعنا بيانات طفل، سنحذفها فوراً."
                  : "Our services are not directed to children under 16 years old, and we do not knowingly collect their personal data. If we discover such data, we will delete it immediately."}
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-bold text-[#D35400]">
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </h2>
            <p className="text-gray-700 leading-7">
              {isRTL 
                ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا."
                : "If you have any questions about this Privacy Policy, please contact us."}
            </p>
          </section>

          {/* Footer Note */}
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>
              {isRTL 
                ? `© ${new Date().getFullYear()} ${brandName}. جميع الحقوق محفوظة.`
                : `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
