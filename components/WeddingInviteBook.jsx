/*
  Вставь в public/index.html (или в head приложения) этот тег, чтобы шрифт загружался:
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap" rel="stylesheet">

  В этом файле я применяю 'Dancing Script' ко всему приложению через inline-style на корневом элементе.
*/

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CalendarHeart,
  MapPin,
  Heart,
  Send,
} from "lucide-react";
import emailjs from "@emailjs/browser";

export default function WeddingInviteBook() {
  const [page, setPage] = useState(0);
  const total = 5;

  const touchStartX = useRef(null);
  const onTouchStart = (e) =>
    (touchStartX.current = e.changedTouches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) prev();
    if (dx < -50) next();
    touchStartX.current = null;
  };

  useEffect(() => {
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

  return (
    <div
      style={{ fontFamily: "'Dancing Script', cursive" }}
      className="min-h-screen w-full bg-gradient-to-b from-[#fdf6f0] via-white to-[#f5ebe1] flex items-center justify-center p-4 md:p-8"
    >
      <CardWrapper className="w-full max-w-3xl">
        <CardContentWrapper className="p-0">
          {page !== 0 && <Header page={page} total={total} goTo={goTo} />}

          <div
            className="relative h-[70vh] md:h-[68vh] lg:h-[60vh] select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {page !== 0 && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <NavButton
                    direction="left"
                    onClick={prev}
                    disabled={page === 0}
                  />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <NavButton
                    direction="right"
                    onClick={next}
                    disabled={page === total - 1}
                  />
                </div>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 40, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -40, rotateY: -10 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="h-full w-full"
              >
                {page === 0 && <CoverPage onNext={next} />}
                {page === 1 && <InvitationWithSchedulePage />}
                {page === 2 && <SeatingPage />}
                {page === 3 && <RsvpEmailPage onSubmitted={() => next()} />}
                {page === 4 && <AddressPage />}
              </motion.div>
            </AnimatePresence>
          </div>

          {page !== 0 && (
            <Footer page={page} total={total} prev={prev} next={next} />
          )}
        </CardContentWrapper>
      </CardWrapper>
    </div>
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

function CardContentWrapper({ children, className }) {
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

function NavButton({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="m-2 md:m-4 rounded-full shadow-sm bg-white/70 hover:bg-white disabled:opacity-40 flex items-center justify-center p-2"
      aria-label={
        direction === "left" ? "Предыдущая страница" : "Следующая страница"
      }
    >
      {direction === "left" ? (
        <ChevronLeft className="h-6 w-6" />
      ) : (
        <ChevronRight className="h-6 w-6" />
      )}
    </button>
  );
}

function CoverPage({ onNext }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#fdf6f0]">
      {/* Верхняя половина — картинка */}
      <div className="h-1/2 w-full flex-shrink-0 flex items-center justify-center">
        <img
          src="../wedding-banner.png"
          alt="Wedding Banner"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Нижняя половина — текст и кнопка */}
      <div className="h-1/2 w-full flex flex-col justify-center items-center px-6 text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl tracking-tight text-[#3a1f1f]"
        >
          Приглашение на свадьбу
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-3 text-sm md:text-base text-[#4b2e2e]/90"
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

function InvitationWithSchedulePage() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2 text-[#6b4226]">
          <CalendarHeart className="h-5 w-5" />
          <span className="uppercase tracking-widest text-xs">
            Счастливый день
          </span>
        </div>
        <h2 className="mt-2 text-2xl md:text-4xl text-[#3a1f1f]">
          Мы говорим «Да!»
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#4b2e2e]/90 leading-relaxed">
          Дорогие друзья! С радостью приглашаем вас разделить с нами особенный
          день.
        </p>
        <div className="mt-6">
          <h3 className="font-semibold text-[#3a1f1f] mb-2">
            Расписание мероприятия
          </h3>
          <ul className="space-y-2 text-[#4b2e2e]/90">
            <li>18:00 — Прибытие гостей</li>
            <li>18:15 — Начало венчания</li>
            <li>18:45-21:00 — Развлечения и ужин</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SeatingPage() {
  const tables = Array.from({ length: 12 }, (_, i) =>
    Array.from({ length: 7 }, (_, j) => `Гость ${j + 1}`)
  );

  return (
    <div className="h-full w-full p-6 md:p-10 overflow-auto flex flex-col items-center">
      <h2 className="font-serif text-3xl md:text-5xl text-[#3a1f1f] mb-6 text-center">
        Рассадка гостей
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {tables.map((table, idx) => (
          <div
            key={idx}
            className="bg-white/80 border border-[#d9c2a9] rounded-2xl p-4 shadow-md flex flex-col items-center"
          >
            <h3 className="font-semibold text-[#4b2e2e] mb-2">
              Стол {idx + 1}
            </h3>
            <ul className="text-sm md:text-base text-[#4b2e2e]/90 space-y-1">
              {table.map((guest, gIdx) => (
                <li key={gIdx}>{guest}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function RsvpEmailPage({ onSubmitted }) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attend, setAttend] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailjs.init("T3044GPpyR59dc_zU"); // вставь сюда Public Key из EmailJS
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Пожалуйста, укажите имя");
    if (!attend) return setError("Пожалуйста, выберите ответ");

    const templateParams = { name, attending: attend, guests, message };

    emailjs
      .send("service_svtyp46", "template_s457txe", templateParams)
      .then(() => {
        setSent(true);
        onSubmitted();
      })
      .catch(() => setError("Ошибка при отправке. Попробуйте снова."));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 md:p-10">
      <h2 className="font-serif text-2xl md:text-4xl text-center text-[#3a1f1f] mb-6">
        Ваш Ответ
      </h2>

      {!sent ? (
        <form
          onSubmit={submit}
          className="w-full max-w-md flex flex-col gap-5 bg-white/90 p-6 rounded-2xl shadow-lg"
        >
          {/* Имя */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full p-3 border border-[#d9c2a9] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
              placeholder="Имя"
            />
          </div>

          {/* Количество гостей */}
          <div className="w-full">
            <input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Введите количество гостей"
              className="w-full rounded-xl border border-[#d9c2a9] px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#8b5e3c] focus:ring-[#8b5e3c] sm:text-sm"
            />
          </div>

          {/* Придет / Не придет */}
          <select
            value={attend}
            onChange={(e) => setAttend(e.target.value)}
            className="w-full p-3 border border-[#d9c2a9] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
          >
            <option value="">Выберите ответ</option>
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>

          {/* Сообщение */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Сообщение (по желанию)"
            className="w-full p-3 border border-[#d9c2a9] rounded-lg focus:outline-none focus:border-[#8b5e3c] resize-none h-24"
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-[#8b5e3c] text-white rounded-2xl hover:bg-[#a9745a] font-semibold transition-colors"
          >
            Отправить
          </button>
        </form>
      ) : (
        <div className="text-center mt-6 text-[#4b2e2e] font-semibold">
          Спасибо! Ваш ответ отправлен.
        </div>
      )}
    </div>
  );
}

function AddressPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 md:p-10">
      <MapPin className="h-10 w-10 text-[#6b4226]" />
      <h2 className="mt-4 font-serif text-2xl md:text-4xl text-[#3a1f1f] text-center">
        Где нас найти
      </h2>
      <p className="mt-2 text-center text-[#4b2e2e]/90">
        Wedding Hall "Selene"
      </p>
      <p className="mt-2 text-center text-[#4b2e2e]/90">
        충남 천안시 동남구 배울1길 35
      </p>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Naver Map */}
        <a
          href="https://naver.me/xxFFYWmg"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#8b5e3c] text-white rounded-2xl hover:bg-[#a9745a] text-center font-semibold"
        >
          Открыть в Naver Map
        </a>

        {/* Kakao Map */}
        <a
          href="https://kko.kakao.com/RALXOaJ5Yn"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#c99b6c] text-white rounded-2xl hover:bg-[#b07a4f] text-center font-semibold"
        >
          Открыть в Kakao Map
        </a>
      </div>
    </div>
  );
}
