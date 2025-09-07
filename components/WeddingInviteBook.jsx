import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CalendarHeart,
  MapPin,
  Heart,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import CryptoJS from "crypto-js";
import Helmet from "react-helmet";

const SECRET_KEY = "my_super_secret_key"; // Секретный ключ

// --- Хук: имена гостей из URL ---
function useGuestNamesFromUrl() {
  const [guestNames, setGuestNames] = useState([]);

  const decrypt = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // на всякий случай для SSR
    const params = new URLSearchParams(window.location.search);

    // Поддержка нескольких схем
    const combinedEncrypted = params.get("guests"); // "Иван,Мария"
    const name1 = params.get("name1") || params.get("guest1");
    const name2 = params.get("name2") || params.get("guest2");

    let names = [];
    for (let [key, value] of params.entries()) {
      const decryptedKey = decrypt(decodeURIComponent(key));
      if (decryptedKey === "guests") {
        const decryptedValue = decrypt(decodeURIComponent(value));
        if (decryptedValue) {
          names = decryptedValue
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        break; // нашли параметр, можно прервать цикл
      }
    }
    setGuestNames(names);
  }, []);

  // Умный формат списка имен: "Иван", "Иван и Мария", "Иван, Мария и Алексей"
  const formatNames = (arr) => {
    if (arr.length <= 1) return arr[0] || "";
    if (arr.length === 2) return `${arr[0]} и ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")} и ${arr[arr.length - 1]}`;
  };

  const displayName = guestNames.length ? formatNames(guestNames) : "гости";
  let mainText;

  if (guestNames.length === 1) {
    mainText = `С радостью и трепетом приглашаем Вас стать свидетелем нашего события, свадьбы и начала новой главы. Разделите с нами этот особенный и долгожданный день.`;
  } else if (guestNames.length > 1) {
    mainText = `С радостью и трепетом приглашаем Вас стать свидетелями нашего события, свадьбы и начала новой главы. Разделите с нами этот особенный и долгожданный день.`;
  }

  return { guestNames, displayName, mainText };
}

export default function WeddingInviteBook() {
  const [page, setPage] = useState(0);
  const total = 6;

  // --- свайпы ---
  // const touchStartX = useRef(null);
  // const onTouchStart = (e) =>
  //   (touchStartX.current = e.changedTouches[0].clientX);
  // const onTouchEnd = (e) => {
  //   if (touchStartX.current == null) return;
  //   const dx = e.changedTouches[0].clientX - touchStartX.current;
  //   if (dx > 50) prev();
  //   if (dx < -50) next();
  //   touchStartX.current = null;
  // };

  // --- стрелки на клавиатуре ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const next = () => setPage((p) => Math.min(p + 1, total - 1));
  const prev = () => setPage((p) => Math.max(p - 1, 0));
  const goTo = (i) => setPage(Math.max(0, Math.min(total - 1, i)));

  // --- Имена гостей из URL ---
  const { guestNames, displayName, mainText } = useGuestNamesFromUrl();

  return (
    <>
      {/* --- Open Graph / SEO мета-теги --- */}
      <Helmet>
        <title>Приглашение на свадьбу Михаила & Валерии</title>
        <meta
          name="description"
          content="Приглашение на свадьбу Михаила и Валерии — 4 октября 2025. Разделите с нами этот особенный день!"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Приглашение на свадьбу Михаила & Валерии"
        />
        <meta
          property="og:description"
          content="Приглашение на свадьбу Михаила и Валерии — 4 октября 2025. Разделите с нами этот особенный день!"
        />
        <meta property="og:image" content="/banner.png" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Helmet>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#fdf6f0] via-white to-[#f5ebe1] flex items-center justify-center p-4 md:p-8">
        {guestNames.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">
              Ссылка некорректна
            </h2>
            <p>
              Похоже, вы перешли по ссылке без необходимых параметров.
              Пожалуйста, свяжитесь с организаторами.
            </p>
          </div>
        ) : (
          <CardWrapper className="w-full max-w-3xl">
            <CardContentWrapper className="p-0">
              {page !== 0 && <Header page={page} total={total} goTo={goTo} />}

              <div className="relative h-[70vh] md:h-[68vh] lg:h-[60vh] select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, x: 40, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -40, rotateY: -10 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="h-full w-full"
                  >
                    {page === 0 && (
                      <CoverPage onNext={next} displayName={displayName} />
                    )}
                    {page === 1 && (
                      <InvitationWithSchedulePage
                        displayName={displayName}
                        mainText={mainText}
                      />
                    )}
                    {page === 2 && (
                      <RsvpEmailPage
                        onSubmitted={() => next()}
                        displayName={displayName}
                      />
                    )}
                    {page === 3 && <SeatingPage />}
                    {page === 4 && <VideoGreetingPage />}
                    {page === 5 && <AddressPage />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {page !== 0 && (
                <Footer page={page} total={total} prev={prev} next={next} />
              )}
            </CardContentWrapper>
          </CardWrapper>
        )}
      </div>
    </>
  );
}

// --- Components ---

function CardWrapper({ children, className }) {
  return (
    <div
      className={`bg-white/80 border border-[#d9c2a9]/60 shadow-xl rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

function CardContentWrapper({ children, className = "" }) {
  // ✅ фикс твоей ошибки шаблонной строки
  return <div className={`p-4 md:p-6 ${className}`}>{children}</div>;
}

function Header({ page, total, goTo }) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-white/60">
      <div className="flex items-center gap-2 text-[#6b4226]">
        <Heart className="h-5 w-5" />
        <span className="font-semibold tracking-wide">Wedding Invitation</span>
      </div>
      <div className="flex items-center gap-1" aria-label="Progress">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              page === i
                ? "w-6 bg-[#8b5e3c]"
                : "w-2 bg-[#d9c2a9] hover:bg-[#a9745a]"
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function Footer({ page, total, prev, next }) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t bg-white/60">
      <div className="text-xs md:text-sm text-[#4b2e2e]/80">
        Стр. {page + 1} из {total}
      </div>
      <div className="flex gap-2">
        <button
          onClick={prev}
          disabled={page === 0}
          className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Назад
        </button>
        <button
          onClick={next}
          disabled={page === total - 1}
          className="px-4 py-2 rounded-2xl bg-[#8b5e3c] text-white hover:bg-[#a9745a] disabled:opacity-50 flex items-center gap-1"
        >
          Далее <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ---------------- Pages ----------------

function CoverPage({ onNext }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#fdf6f0]">
      <div className="h-1/2 w-full flex-shrink-0 flex items-center justify-center">
        <img
          src="../wedding-banner.png"
          alt="Wedding Banner"
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="h-1/2 w-full flex flex-col justify-center items-center px-6 text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl tracking-tight text-[#6b4226]"
        >
          Приглашение на свадьбу
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-3 text-sm md:text-xl leading-relaxed text-[#6b4226]"
        >
          Михаил & Валерия — 4 октября 2025
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-2xl bg-[#8b5e3c] text-white hover:bg-[#a9745a]"
          >
            Открыть приглашение
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function InvitationWithSchedulePage({ displayName, mainText }) {
  return (
    <div className="h-full overflow-auto p-6 md:p-10 flex justify-center">
      <div className="max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2 text-[#6b4226] mb-4">
          <CalendarHeart className="h-6 w-6" />
          <span className="uppercase tracking-widest text-sm md:text-xs">
            Счастливый день
          </span>
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl text-[#6b4226] leading-snug">
          {displayName}
        </h2>
        <p className="mt-4 text-base md:text-lg leading-relaxed font-lora text-[#4b2e2e]">
          {mainText} <br />
          <span className="mt-2 block italic">С любовью~</span>
        </p>
        <div className="mt-8 text-left bg-white/80 border border-[#d9c2a9] rounded-2xl p-6 shadow-md">
          <h3 className="font-playfair text-xl md:text-2xl text-center text-[#6b4226] mb-4">
            Расписание мероприятия
          </h3>
          <ul className="space-y-2 text-[#4b2e2e] font-lora text-base md:text-lg">
            <li>
              <strong>День:</strong> 4.10.2025
            </li>
            <li>
              <strong>Венчание в Церкви:</strong> 17:00 - 17:30
            </li>
            <li>
              <strong>Развлечения и ужин в Wedding Hall:</strong> 18:00 – 21:00
            </li>
          </ul>
        </div>
        <p className="mt-6 italic font-lora text-[#4b2e2e]">
          Наш вечер будет простым: без речей и тостов, без алкоголя — но с
          тёплой атмосферой и вниманием к каждому, кто рядом.
        </p>
      </div>
    </div>
  );
}

function SeatingPage() {
  const tables = Array.from({ length: 12 }, () =>
    Array.from({ length: 7 }, (_, j) => `Гость ${j + 1}`)
  );

  return (
    //add relative
    <div className="h-full w-full p-6 md:p-10 overflow-auto flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl mb-6 text-center text-[#6b4226]">
        Рассадка гостей
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {tables.map((table, idx) => (
          <div
            key={idx}
            className="bg-white/80 border border-[#d9c2a9] rounded-2xl p-4 shadow-md flex flex-col items-center"
          >
            <h3 className="font-semibold mb-2">Стол {idx + 1}</h3>
            <ul className="text-sm md:text-base space-y-1">
              {table.map((guest, gIdx) => (
                <li key={gIdx}>{guest}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* --- Затемняющий слой с сообщением --- */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl">
        <h3 className="text-xl md:text-3xl font-semibold mb-2 text-[#6b4226]">
          Рассадка гостей
        </h3>
        <p className="text-center text-sm md:text-lg">
          Рассадка будет доступна позже. Следите за обновлениями!
        </p>
      </div>
    </div>
  );
}

function RsvpEmailPage({ displayName, onSubmitted }) {
  const [attend, setAttend] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- новое состояние

  useEffect(() => {
    emailjs.init("T3044GPpyR59dc_zU");
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (!attend) return setError("Пожалуйста, выберите ответ");

    setLoading(true); // блокируем кнопку сразу

    const templateParams = { name: displayName, attending: attend, message };
    emailjs
      .send("service_svtyp46", "template_s457txe", templateParams)
      .then(() => {
        setSent(true);
        onSubmitted();
      })
      .catch(() => setError("Ошибка при отправке. Попробуйте снова."))
      .finally(() => setLoading(false)); // разблокируем кнопку, если нужно повторное отправление
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 md:p-10">
      <h2 className="text-2xl md:text-4xl text-center mb-6 text-[#6b4226]">
        Ваш Ответ
      </h2>

      {!sent ? (
        <form
          onSubmit={submit}
          className="w-full max-w-md flex flex-col gap-5 bg-white/90 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-center text-lg md:text-3xl font-medium mb-2 ">
            {displayName}
          </h2>

          <label className="text-sm md:text-base font-medium">
            Сможете ли Вы присутствовать на свадьбе?
          </label>
          <select
            value={attend}
            onChange={(e) => setAttend(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#8b5e3c]"
          >
            <option value="">Выберите вариант</option>
            <option value="yes">Да, с радостью</option>
            <option value="no">К сожалению, нет</option>
          </select>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Сообщение (по желанию)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#8b5e3c] h-24 resize-none"
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading} // <-- блокировка кнопки
            className={`w-full py-3 bg-[#8b5e3c] text-white rounded-2xl font-semibold hover:bg-[#a9745a] transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </form>
      ) : (
        <div className="text-center mt-6 font-semibold">
          Спасибо! Ваш ответ отправлен.
        </div>
      )}
    </div>
  );
}

function AddressPage() {
  return (
    <div className="h-full overflow-auto flex flex-col items-center justify-center p-6 md:p-10">
      <MapPin className="h-10 w-10 text-[#6b4226]" />
      <h2 className="mt-4 text-2xl md:text-4xl text-center text-[#6b4226]">
        Адреса
      </h2>

      {/* --- Церковь --- */}
      <div className="mt-6 bg-white/80 border border-[#d9c2a9] rounded-2xl p-6 shadow-md w-full max-w-xl text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-[#6b4226] mb-2">
          Церковь "Любовь Христа"
        </h3>
        <p className="text-sm md:text-lg">
          충청남도 천안시 동남구 천안천7길 16
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <a
            href="https://naver.me/xxxxChurch"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#8b5e3c] text-white rounded-2xl hover:bg-[#a9745a] text-sm md:text-base font-semibold"
          >
            Naver Map
          </a>
          <a
            href="https://kko.kakao.com/xxxxChurch"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#c99b6c] text-white rounded-2xl hover:bg-[#b07a4f] text-sm md:text-base font-semibold"
          >
            Kakao Map
          </a>
        </div>
      </div>

      {/* --- Wedding Hall --- */}
      <div className="mt-6 bg-white/80 border border-[#d9c2a9] rounded-2xl p-6 shadow-md w-full max-w-xl text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-[#6b4226] mb-2">
          Wedding Hall "Selene"
        </h3>
        <p className="text-sm md:text-lg">충남 천안시 동남구 배울1길 35</p>
        <div className="flex justify-center gap-4 mt-3">
          <a
            href="https://naver.me/xxFFYWmg"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#8b5e3c] text-white rounded-2xl hover:bg-[#a9745a] text-sm md:text-base font-semibold"
          >
            Naver Map
          </a>
          <a
            href="https://kko.kakao.com/RALXOaJ5Yn"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#c99b6c] text-white rounded-2xl hover:bg-[#b07a4f] text-sm md:text-base font-semibold"
          >
            Kakao Map
          </a>
        </div>
      </div>
    </div>
  );
}

function VideoGreetingPage() {
  return (
    <div className="h-full w-full p-6 md:p-10 flex flex-col items-center justify-start overflow-auto bg-gradient-to-b from-[#f5ebe1] to-[#fdf6f0]">
      <h2 className="text-3xl md:text-5xl mb-6 text-center text-[#6b4226]">
        Видео-поздравление (по желанию)
      </h2>

      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-6">
        {/* --- Левая часть: инструкция --- */}
        <div className="flex-1 bg-white/90 border border-[#d9c2a9] rounded-2xl p-6 shadow-md max-h-[60vh] overflow-auto">
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-[#6b4226]">
            Опросник для свадебного видео-поздравления
          </h3>
          <p className="mb-4 text-sm md:text-base italic text-[#4b2e2e]">
            Это видео-поздравление не обязательно. Если хотите, вы можете
            записать своё послание молодожёнам. <br />
            <span className="font-semibold">
              Видео должно быть горизонтальным с разрешением 16:9.
            </span>
          </p>
          <ol className="list-decimal list-inside text-[#4b2e2e] space-y-3 text-sm md:text-base">
            <li>
              Что бы вы хотели пожелать или просто сказать молодожёнам в день их
              свадьбы? (Можно кратко или развернуто, от души!)
            </li>
            <li>Что вы можете сказать о женихе и невесте?</li>
            <li>
              Какие приятные воспоминания или истории вас связывают с одним из
              молодожёнов или с обоими? (Смешные, трогательные или просто
              памятные моменты)
            </li>
            <li>
              Ваше свадебное напутствие или совет на будущее: (Например: секрет
              счастливого брака, как справляться с трудностями и т.д.)
            </li>
          </ol>
          <p className="mt-4 text-sm md:text-base italic text-[#4b2e2e]">
            Пожалуйста, отвечайте на вопросы искренне и не принужденно, можно с
            юмором, главное — от души. Если на какой-то вопрос не можете
            ответить, просто пропустите его.
          </p>
          <p className="mt-4 text-sm md:text-base font-medium text-[#6b4226]">
            Отправить видео до:{" "}
            <span className="font-semibold">30 сентября 2025</span>
          </p>
        </div>

        {/* --- Правая часть: ссылка на Telegram --- */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white/90 border border-[#d9c2a9] rounded-2xl p-6 shadow-md">
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-[#6b4226]">
            Куда отправить видео
          </h3>
          <a
            href="https://t.me/luna_lina02" // <-- вставь свой Telegram username или ссылку на чат
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#8b5e3c] text-white font-semibold hover:bg-[#a9745a] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.372 0 0 5.373 0 12c0 5.635 3.883 10.33 9.063 11.644.663.12.906-.288.906-.637 0-.313-.012-1.144-.017-2.25-3.685.802-4.462-1.775-4.462-1.775-.601-1.53-1.467-1.936-1.467-1.936-1.2-.82.091-.803.091-.803 1.328.093 2.027 1.36 2.027 1.36 1.178 2.016 3.088 1.434 3.842 1.096.12-.853.462-1.434.84-1.764-2.94-.336-6.033-1.47-6.033-6.54 0-1.444.516-2.625 1.36-3.552-.136-.337-.59-1.694.128-3.534 0 0 1.11-.356 3.64 1.355A12.77 12.77 0 0112 5.802c1.125.005 2.26.152 3.318.447 2.53-1.712 3.64-1.355 3.64-1.355.72 1.84.264 3.197.128 3.534.844.927 1.36 2.108 1.36 3.552 0 5.088-3.096 6.198-6.045 6.534.474.408.896 1.218.896 2.456 0 1.774-.016 3.2-.016 3.632 0 .352.24.765.918.635C20.118 22.33 24 17.635 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Написать в Telegram
          </a>
          <p className="text-center text-sm md:text-base text-[#4b2e2e] mt-4">
            Нажмите кнопку, чтобы перейти в Telegram
          </p>
        </div>
      </div>
    </div>
  );
}
