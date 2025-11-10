# ExamSarthi - Your AI-Powered Exam Preparation Partner 🚀

**ExamSarthi** is a comprehensive AI-powered platform designed to help students conquer Indian competitive exams, regional exams, and college examinations. It serves as your 24/7 personalized study companion, offering a tailored learning experience through advanced AI.

---

## 💡 About The Project

Preparing for exams in India is a marathon. Students juggle vast syllabuses, diverse study materials, and the constant pressure to perform. ExamSarthi was built to be the all-in-one solution that streamlines this process.

Instead of just storing your notes, ExamSarthi actively *engages* with them. It allows you to upload your materials (PDFs, notes) and then generates flashcards, mind maps, and practice quizzes *from your own content*. Our 24/7 AI Tutor is always available to clear doubts, explain complex topics, and provide support in multiple languages.

## ✨ Key Features

* **🤖 AI Tutor Chat**
    * 24/7 instant access to AI-powered tutoring.
    * Personalized, in-depth explanations and doubt clearing.
    * Multi-language support for better understanding.

* **📚 Study Material Management**
    * Upload and organize all your study materials (PDFs, notes, documents).
    * Secure, personal storage with text extraction and processing.

* **🧠 Smart Learning Tools**
    * **Automated Flashcards**: Instantly generated from your study materials.
    * **Mind Maps**: Visually organize complex topics and concepts.
    * **Practice Tests**: Get custom quizzes that match your exam patterns.
    * **AI Study Plans**: Generate personalized study schedules based on your exam date and goals.

* **📊 Progress Tracking**
    * Detailed analytics and insights into your study habits.
    * Performance monitoring to identify strengths and weaknesses.
    * Personalized suggestions for improvement.

## 🎯 Supported Exams

We cater to a wide range of Indian examinations:

* **Engineering**: JEE Main & Advanced, GATE
* **Medical**: NEET
* **Civil Services**: UPSC
* **Management**: CAT
* **Professional Courses**: Law, Medical, Engineering
* **Other**: Various Regional and College-specific exams

## 🛠️ Built With

* **Frontend**: React, TypeScript, Tailwind CSS
* **Backend & DB**: Supabase (Auth, Postgres, Storage, Realtime)
* **AI Integration**: Custom-trained AI models

## 🚀 Getting Started (Developer Setup)

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm / pnpm / yarn
* A Supabase account (for database, auth, and storage)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Hargun-Preet/examsarthi.git](https://github.com/Hargun-Preet/examsarthi.git)
    cd examsarthi
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file in the root of your project and add your Supabase project credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🔒 Security Features

* Secure authentication and user management via Supabase Auth.
* Personal document storage with access controls.
* Row-Level Security (RLS) enabled on database tables to ensure user data privacy.
* Encrypted data transmission (SSL).

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.

Made with ❤️ for Indian students
