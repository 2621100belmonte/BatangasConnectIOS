# LipaConnect AI (BatangasConnectIOS) — Smart Tourism Mobile Application
*Course:* PT101 – Platform Technologies  
*Project Phase:* Phase 2 – Cross-Platform iOS & Android Application Development  
*Target Locale:* Lipa City, Batangas, Philippines ("Little Rome & Coffee Capital of the Philippines")

---

## 1. Application Overview
*LipaConnect AI* is a cross-platform smart tourism mobile application designed to help students, local visitors, and tourists explore Lipa City, Batangas. Built under a strict *Two-Page Architecture*, the app combines local session authentication with an interactive, filterable tourism dashboard and an AI-powered Lipa City itinerary assistant.

### Key Features
- *Page 1 — Authentication (Sign In & Sign Up):*
  - Clean tabbed interface for existing user login and new student/tourist registration.
  - Persistent user storage and session state powered by @react-native-async-storage/async-storage.
  - Built-in one-tap *Demo Account Auto-Fill* (student@ub.edu.ph / Password123) for instant evaluation.
- *Page 2 — Lipa City Smart Tourism Dashboard:*
  - *2×2 Interactive Category Grid:* Quick filtering across *Best Places (5)*, *Best Food (5)*, *Activities (5)*, and *AI Assistant*.
  - *Real-Time Search & Filtering:* Instant keyword search across all 15 curated Lipa City destinations, dishes, and activities.
  - *Featured Landmark Banner:* Direct highlight card for *San Sebastian Cathedral*.
  - *Destination Detail Modals:* Rich modal views displaying operating hours, estimated fees, descriptions, and local Batangueño tips.
  - *Special Feature — LipaConnect AI Tourism Assistant:* Interactive conversational travel planner with one-tap smart prompts (1-Day Itinerary, Best Lomi & Barako, Must-Visit Places, Activities).
  - *Safe Session Logout:* Clears active session storage and returns cleanly to Page 1.

---

## 2. Technology Stack
- *Framework:* React Native with Expo (SDK 58 / Snack iOS Simulator)
- *Language:* JavaScript (ES6+)
- *Local Persistence:* @react-native-async-storage/async-storage
- *IDE & Testing:* Visual Studio Code, Expo Go (Physical Device), and Expo Snack (iPhone 15 Pro iOS Simulator)
- *Version Control:* Git & GitHub (BatangasConnectIOS)

---

## 3. Curated Lipa City Dataset (15 Items)
| Category | Highlights Included |
| :--- | :--- |
| *5 Best Places* | San Sebastian Cathedral, Our Lady of Mount Carmel Church, Casa de Segunda, Mt. Malarayat Viewpoint, The Farm at San Benito |
| *5 Best Food* | Lomi King, Cafe de Lipa (Kapeng Barako), Liam’s Lomi House, Hapag Filipino at Casa Marikit, Loghouse Café Lipa |
| *5 Best Activities* | Barako Coffee Farm & Roasting Tour, Mt. Malarayat Forest Trail Hike, Mount Malarayat Golf & Country Club, Lipa City Community Park Walk, Lipa "Little Rome" Heritage Pilgrimage |

---

## 4. How to Run Locally
1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd BatangasConnectIOS