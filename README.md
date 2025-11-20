# ShadowingNinja - YouTube 영어 학습 웹앱

YouTube 영상과 자막을 활용한 인터랙티브 영어 학습 플랫폼

## 🚀 Features

### Phase 1: Blind Listening
- 스크립트 없이 영상 전체 듣기
- 집중력 향상을 위한 몰입형 학습

### Phase 2: Script Highlighting
- 문장별 자동 하이라이팅
- 클릭으로 타임스탬프 이동
- 더블클릭으로 상세 노트 작성
- 텍스트 드래그로 단어/구문 하이라이팅
- AI 기반 학습 팁 생성 (연음, 문법, 발음, 속도)

### Phase 3: Shadowing
- 1문장/1문단/전체 단위 선택
- 반복 듣기
- 음성 녹음 및 비교
- 학습 진도 추적

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with localStorage persistence)
- **APIs**: 
  - YouTube IFrame API
  - youtube-transcript
  - Google Gemini AI
- **Audio**: MediaRecorder API

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/shadowing-ninja.git
cd shadowing-ninja

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add:
# GEMINI_API_KEY=your_gemini_api_key_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Project Structure

```
shadowing-ninja/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transcript/    # YouTube transcript fetching
│   │   │   └── ai-tip/        # AI tip generation
│   │   ├── study/[videoId]/   # Study session page
│   │   ├── page.tsx           # Home page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── YouTubePlayer.tsx  # YouTube IFrame integration
│   │   └── SentenceItem.tsx   # Interactive sentence component
│   ├── lib/
│   │   └── transcript-parser.ts
│   ├── store/
│   │   └── useStudyStore.ts   # Zustand store
│   └── types/
│       └── index.ts           # TypeScript types
└── package.json
```

## 🎯 Usage

1. **홈 페이지에서 YouTube URL 입력**
2. **Phase 1**: 스크립트 없이 영상 듣기
3. **Phase 2**: 스크립트와 함께 문장별 학습
   - 어려운 문장 더블클릭 → 노트 작성
   - 단어/구문 드래그 → 하이라이팅 & 캡션 추가
   - AI 팁 생성으로 학습 도움받기
4. **Phase 3**: 쉐도잉 연습
   - 반복 듣기 → 녹음 → 비교

## 📝 Development Roadmap

### Phase 1: Core MVP ✅
- [x] Project setup
- [x] YouTube integration
- [x] Transcript system
- [x] Data management (Zustand + localStorage)
- [x] Home page
- [x] Study session page with 3 phases
- [x] Sentence highlighting and notes
- [ ] Shadowing mode with recording

### Phase 2: Advanced Features
- [ ] Full AI integration
- [ ] Database (Supabase)
- [ ] User authentication
- [ ] Advanced UX improvements
- [ ] Mobile optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

- YouTube IFrame API
- Google Gemini AI
- Next.js Team
