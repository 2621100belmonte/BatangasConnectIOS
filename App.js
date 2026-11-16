import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_USERS_KEY = '@lipaconnect_users_v2';
const STORAGE_SESSION_KEY = '@lipaconnect_session_v2';

const DEFAULT_USERS = [
  {
    name: 'UB Student Demo',
    email: 'student@ub.edu.ph',
    password: 'Password123',
  },
];

const LIPA_DATA = [
  // 5 BEST PLACES IN LIPA CITY
  {
    id: 'p1',
    category: 'Places',
    badge: 'Heritage Landmark',
    title: 'San Sebastian Cathedral',
    subtitle: 'Brgy. Poblacion • "Little Rome" Icon',
    rating: '4.9',
    hours: '5:30 AM – 7:00 PM',
    fee: 'Free Admission',
    emoji: '⛪',
    accent: '#0EA5E9',
    bgTint: '#E0F2FE',
    description:
      'The iconic neoclassical seat of the Archdiocese of Lipa, giving Lipa City its famous title as the "Little Rome of the Philippines." Features grand arched interiors, stained glass, and a serene courtyard.',
    tips: 'Visit early morning or late afternoon for peaceful prayer and architectural photography.',
  },
  {
    id: 'p2',
    category: 'Places',
    badge: 'Pilgrimage & Retreat',
    title: 'Our Lady of Mount Carmel Church',
    subtitle: 'Brgy. Antipolo del Norte • Apparition Site',
    rating: '4.9',
    hours: '6:00 AM – 6:30 PM',
    fee: 'Free Admission',
    emoji: '🕊️',
    accent: '#0284C7',
    bgTint: '#E0F2FE',
    description:
      'Known worldwide as the site of the 1948 rose petal apparitions of Our Lady, Mary Mediatrix of All Grace. Surrounded by tranquil gardens ideal for reflection.',
    tips: 'Dress modestly when entering the main chapel and cloister grounds.',
  },
  {
    id: 'p3',
    category: 'Places',
    badge: 'Heritage Museum',
    title: 'Casa de Segunda',
    subtitle: '198 Calle Rizal • Katigbak Ancestral House',
    rating: '4.8',
    hours: '9:00 AM – 4:00 PM (Tue–Sun)',
    fee: '₱100 Regular / ₱80 Student',
    emoji: '🏛️',
    accent: '#0369A1',
    bgTint: '#E0F2FE',
    description:
      'A beautifully preserved 1880s bahay-na-bato and ancestral home of Segunda Katigbak—José Rizal’s first love. Showcases Spanish-era furniture, capiz windows, and Lipa coffee history.',
    tips: 'Ask the museum guide about the original letters and heirlooms from the Katigbak family.',
  },
  {
    id: 'p4',
    category: 'Places',
    badge: 'Eco & Nature Escape',
    title: 'Mt. Malarayat Viewpoint & Foothills',
    subtitle: 'Brgy. Talisay / Malarayat Range • Cool Breeze',
    rating: '4.8',
    hours: '6:00 AM – 6:00 PM',
    fee: 'Free / Trail Guide Optional',
    emoji: '⛰️',
    accent: '#0D9488',
    bgTint: '#CCFBF1',
    description:
      'The towering mountain range flanking eastern Lipa City, famous for cool highland air, lush forest trails, and sweeping views over Batangas.',
    tips: 'Bring a light jacket—temperatures drop noticeably in the late afternoon.',
  },
  {
    id: 'p5',
    category: 'Places',
    badge: 'Wellness & Nature',
    title: 'The Farm at San Benito',
    subtitle: 'Brgy. Tipakan • World-Renowned Eco Sanctuary',
    rating: '4.9',
    hours: '8:00 AM – 8:00 PM (Day Tour)',
    fee: 'Day Pass Packages Available',
    emoji: '🌿',
    accent: '#059669',
    bgTint: '#D1FAE5',
    description:
      'A 52-hectare holistic medical wellness resort tucked inside a lush coconut jungle in Lipa City, celebrated globally for plant-based cuisine and serene lagoons.',
    tips: 'Book a Day Sanctuary pass in advance if visiting for lunch and wellness walks.',
  },

  // 5 BEST FOOD IN LIPA CITY
  {
    id: 'f1',
    category: 'Food',
    badge: 'Lipa Signature Dish',
    title: 'Lomi King — Original Lipa Lomi',
    subtitle: 'JP Laurel Highway • Thick Egg-Noodle Bowl',
    rating: '4.9',
    hours: '7:00 AM – 9:00 PM',
    fee: '₱110 – ₱220 per bowl',
    emoji: '🍜',
    accent: '#F59E0B',
    bgTint: '#FEF3C7',
    description:
      'Home of authentic Lipa-style lomi—rich, thick savory broth loaded with fresh miki noodles, kikiam, meatballs, liver, and chicharon toppings without soup dilution.',
    tips: 'Mix calamansi, soy sauce, and chopped red onions + chili on a saucer for the true Batangueño dip.',
  },
  {
    id: 'f2',
    category: 'Food',
    badge: 'Coffee Capital Heritage',
    title: 'Cafe de Lipa — Pure Kapeng Barako',
    subtitle: 'SM City Lipa / Ayala Highway • Liberica Brew',
    rating: '4.8',
    hours: '8:00 AM – 9:00 PM',
    fee: '₱95 – ₱180',
    emoji: '☕',
    accent: '#D97706',
    bgTint: '#FEF3C7',
    description:
      'Celebrating Lipa City’s legacy as the Coffee Capital of the Philippines with bold, aromatic Batangas Liberica (Barako) coffee, muscovado lattes, and suman.',
    tips: 'Grab a bag of freshly roasted whole-bean Kapeng Barako as pasalubong.',
  },
  {
    id: 'f3',
    category: 'Food',
    badge: 'Local Street Classic',
    title: 'Liam’s Lomi House',
    subtitle: 'Brgy. Marawoy • Overload Batangas Lomi',
    rating: '4.8',
    hours: '8:00 AM – 8:30 PM',
    fee: '₱95 – ₱195',
    emoji: '🥣',
    accent: '#EA580C',
    bgTint: '#FFEDD5',
    description:
      'A beloved Lipa institution serving steaming bowls of Special Overload Lomi topped with crispy lechon kawali, sisig, and sweet-savory Batangas sauce.',
    tips: 'Order the "Overload Bilao" when visiting with classmates or family.',
  },
  {
    id: 'f4',
    category: 'Food',
    badge: 'Farm-to-Table Dining',
    title: 'Hapag Filipino at Casa Marikit',
    subtitle: 'Brgy. Tambo • Heirloom Batangueño Cuisine',
    rating: '4.8',
    hours: '10:00 AM – 9:00 PM',
    fee: '₱350 – ₱750',
    emoji: '🍛',
    accent: '#B45309',
    bgTint: '#FEF3C7',
    description:
      'Serves traditional Batangas favorites including Sinaing na Tulingan, Bulalo, Tawilis, and Adobo sa Dilaw in a warm heritage-inspired garden setting.',
    tips: 'Pair Sinaing na Tulingan with steamed kapeng barako rice.',
  },
  {
    id: 'f5',
    category: 'Food',
    badge: 'Artisanal Pastry & Café',
    title: 'Loghouse Café Lipa',
    subtitle: 'Brgy. Marauoy • Cabin Dining & Tsokolate',
    rating: '4.7',
    hours: '9:00 AM – 10:00 PM',
    fee: '₱200 – ₱480',
    emoji: '🥐',
    accent: '#C2410C',
    bgTint: '#FFEDD5',
    description:
      'A cozy rustic timber café famous for thick Batangas tablea tsokolate, freshly baked ensaymada, and hearty pasta plates.',
    tips: 'Best enjoyed during cool evening weather in Lipa.',
  },

  // 5 BEST ACTIVITIES IN LIPA CITY
  {
    id: 'a1',
    category: 'Activities',
    badge: 'Coffee Immersion',
    title: 'Barako Coffee Farm & Roasting Tour',
    subtitle: 'Lipa Agricultural Estates • Bean-to-Cup',
    rating: '4.9',
    hours: '8:00 AM – 4:00 PM',
    fee: '₱250 – ₱500',
    emoji: '🌱',
    accent: '#10B981',
    bgTint: '#D1FAE5',
    description:
      'Walk through shade-grown Liberica coffee orchards in Lipa, learn traditional roasting methods, and taste freshly brewed single-origin Kapeng Barako.',
    tips: 'Morning tours (8:00–10:00 AM) offer the best orchard weather.',
  },
  {
    id: 'a2',
    category: 'Activities',
    badge: 'Outdoor Adventure',
    title: 'Mt. Malarayat Forest Trail Hike',
    subtitle: 'Brgy. Talisay Trailhead • Guided Trek',
    rating: '4.8',
    hours: '5:30 AM – 3:00 PM',
    fee: '₱300 Guide Fee',
    emoji: '🥾',
    accent: '#059669',
    bgTint: '#D1FAE5',
    description:
      'A scenic mossy-forest hike up the ridges of Mt. Malarayat featuring cool mountain mist, native birdlife, and panoramic views of Lipa and Mt. Maculot.',
    tips: 'Wear trail shoes with good grip and bring at least 1.5L of water.',
  },
  {
    id: 'a3',
    category: 'Activities',
    badge: 'Sports & Leisure',
    title: 'Mount Malarayat Golf & Country Club',
    subtitle: 'Brgy. Dagatan • 27-Hole Championship Course',
    rating: '4.9',
    hours: '6:00 AM – 6:00 PM',
    fee: 'Guest Green Fees Apply',
    emoji: '⛳',
    accent: '#0D9488',
    bgTint: '#CCFBF1',
    description:
      'Play a round on one of Asia’s premier championship golf courses set against the dramatic backdrop of the Malarayat mountain range.',
    tips: 'Reserve tee times ahead and follow smart-casual golf attire rules.',
  },
  {
    id: 'a4',
    category: 'Activities',
    badge: 'Family & Recreation',
    title: 'Lipa City Community Park & Night Walk',
    subtitle: 'Poblacion / City Hall Grounds • Evening Leisure',
    rating: '4.7',
    hours: '5:00 AM – 10:00 PM',
    fee: 'Free Admission',
    emoji: '🎡',
    accent: '#14B8A6',
    bgTint: '#CCFBF1',
    description:
      'Stroll the lively open-air plazas of Lipa City at dusk, sample local kakanin and street snacks, and enjoy the cool Batangas evening breeze.',
    tips: 'Great stop right after attending evening Mass at San Sebastian Cathedral.',
  },
  {
    id: 'a5',
    category: 'Activities',
    badge: 'Cultural Heritage Walk',
    title: 'Lipa "Little Rome" Heritage Pilgrimage',
    subtitle: 'Poblacion to Antipolo del Norte • Guided Loop',
    rating: '4.8',
    hours: '7:00 AM – 5:00 PM',
    fee: 'Free Self-Guided Tour',
    emoji: '🧭',
    accent: '#0284C7',
    bgTint: '#E0F2FE',
    description:
      'Connect San Sebastian Cathedral, Casa de Segunda, and Our Lady of Mount Carmel Church in a half-day cultural and spiritual walking/jeepney circuit.',
    tips: 'Start at San Sebastian Cathedral at 8:00 AM and end with lomi lunch nearby.',
  },
];

function getLipaAIResponse(rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  if (q.includes('itinerary') || q.includes('1-day') || q.includes('plan')) {
    return (
      '📅 1-Day Lipa City Smart Itinerary:\n\n' +
      '• 8:00 AM – Morning prayer & photos at San Sebastian Cathedral ("Little Rome").\n' +
      '• 9:30 AM – Heritage tour at Casa de Segunda on Calle Rizal.\n' +
      '• 11:30 AM – Authentic Overload Lomi lunch at Lomi King or Liam’s.\n' +
      '• 2:00 PM – Kapeng Barako tasting at Cafe de Lipa.\n' +
      '• 4:00 PM – Peaceful garden walk at Our Lady of Mount Carmel Church.'
    );
  }
  if (q.includes('lomi') || q.includes('food') || q.includes('eat') || q.includes('coffee') || q.includes('barako')) {
    return (
      '🍜 Top Lipa City Food & Coffee Picks:\n\n' +
      '1. Lomi King – Classic thick-broth Lipa lomi with calamansi-chili dip.\n' +
      '2. Cafe de Lipa – Pure Batangas Liberica (Kapeng Barako) & suman.\n' +
      '3. Liam’s Lomi House – Famous Overload Lomi with lechon kawali.\n' +
      '4. Hapag Filipino – Heirloom Sinaing na Tulingan & Bulalo.'
    );
  }
  if (q.includes('place') || q.includes('church') || q.includes('visit') || q.includes('spot')) {
    return (
      '📍 Must-Visit Landmarks in Lipa City:\n\n' +
      '• San Sebastian Cathedral – Neoclassical heart of "Little Rome."\n' +
      '• Our Lady of Mount Carmel Church – Historic 1948 pilgrimage shrine.\n' +
      '• Casa de Segunda – 1880s ancestral home of Segunda Katigbak.\n' +
      '• The Farm at San Benito – 52-hectare eco-wellness sanctuary.'
    );
  }
  if (q.includes('activity') || q.includes('hike') || q.includes('do') || q.includes('tour')) {
    return (
      '🧭 Best Activities in Lipa City:\n\n' +
      '• Barako Coffee Farm Tour – Bean-to-cup Liberica roasting experience.\n' +
      '• Mt. Malarayat Forest Hike – Cool highland trails & Batangas views.\n' +
      '• Little Rome Heritage Loop – Half-day cathedral, museum & shrine walk.'
    );
  }
  return (
    '👋 Kumusta! I am your LipaConnect AI Tourism Guide.\n\n' +
    'Ask me about:\n' +
    '• "1-Day Itinerary" for a full Lipa City schedule\n' +
    '• "Best Lomi & Barako" for authentic food spots\n' +
    '• "Must-Visit Places" or "Outdoor Activities" around Lipa!'
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [authTab, setAuthTab] = useState('signin');

  // Auth form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' });

  // Dashboard states (Page 2)
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpot, setActiveSpot] = useState(null);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Mabuhay! Welcome to Lipa City — the Little Rome & Coffee Capital of the Philippines. Tap a quick prompt below or ask me anything about Lipa!',
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(STORAGE_USERS_KEY);
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
        }
        const storedSession = await AsyncStorage.getItem(STORAGE_SESSION_KEY);
        if (storedSession) {
          setCurrentUser(JSON.parse(storedSession));
        }
      } catch (e) {}
    })();
  }, []);

  const handleAutoFillDemo = () => {
    setAuthTab('signin');
    setEmail('student@ub.edu.ph');
    setPassword('Password123');
    setAuthMessage({ type: 'info', text: 'Demo credentials filled. Tap "Sign In to Lipa City".' });
  };

  const handleSignIn = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setAuthMessage({ type: 'error', text: 'Please enter both your email and password.' });
      return;
    }
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );
    if (!found) {
      setAuthMessage({
        type: 'error',
        text: 'Invalid email or password. Try the demo account or sign up first.',
      });
      return;
    }
    setAuthMessage({ type: '', text: '' });
    setCurrentUser(found);
    try {
      await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(found));
    } catch (e) {}
  };

  const handleSignUp = async () => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !cleanEmail || !password) {
      setAuthMessage({ type: 'error', text: 'Please complete your name, email, and password.' });
      return;
    }
    if (!cleanEmail.includes('@')) {
      setAuthMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (password.length < 6) {
      setAuthMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      setAuthMessage({ type: 'error', text: 'An account with this email already exists.' });
      return;
    }
    const newUser = { name: cleanName, email: cleanEmail, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setFullName('');
    setPassword('');
    setAuthTab('signin');
    setAuthMessage({
      type: 'success',
      text: 'Account created! Enter your password to sign in.',
    });
    try {
      await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    } catch (e) {}
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    setSelectedCategory('All');
    setSearchQuery('');
    setActiveSpot(null);
    setAiModalVisible(false);
    setAuthMessage({ type: 'info', text: 'Signed out safely. See you again in Lipa City!' });
    try {
      await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {}
  };

  const filteredItems = useMemo(() => {
    return LIPA_DATA.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const sendAiPrompt = (customText) => {
    const promptText = (customText !== undefined ? customText : aiInput).trim();
    if (!promptText) return;
    const now = Date.now();
    const userMsg = {
      id: 'u_' + String(now),
      sender: 'user',
      text: promptText,
    };
    const replyMsg = {
      id: 'a_' + String(now + 1),
      sender: 'ai',
      text: getLipaAIResponse(promptText),
    };
    setAiMessages((prev) => [...prev, userMsg, replyMsg]);
    if (customText === undefined) setAiInput('');
  };

  // =========================================================
  // PAGE 1: AUTHENTICATION (SIGN IN & SIGN UP TABS)
  // =========================================================
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.authSafe}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F8FA" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.authFlex}
        >
          <ScrollView
            contentContainerStyle={styles.authScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.authBrandBox}>
              <View style={styles.brandIconCircle}>
                <Text style={styles.brandIconEmoji}>🧭</Text>
              </View>
              <Text style={styles.brandTitle}>LipaConnect AI</Text>
              <Text style={styles.brandSub}>Smart Tourism • Lipa City, Batangas</Text>
            </View>

            <View style={styles.authCard}>
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[styles.tabBtn, authTab === 'signin' && styles.tabBtnActive]}
                  onPress={() => {
                    setAuthTab('signin');
                    setAuthMessage({ type: '', text: '' });
                  }}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      authTab === 'signin' && styles.tabBtnTextActive,
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, authTab === 'signup' && styles.tabBtnActive]}
                  onPress={() => {
                    setAuthTab('signup');
                    setAuthMessage({ type: '', text: '' });
                  }}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      authTab === 'signup' && styles.tabBtnTextActive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {authMessage.text ? (
                <View
                  style={[
                    styles.alertBox,
                    authMessage.type === 'error'
                      ? styles.alertError
                      : authMessage.type === 'success'
                      ? styles.alertSuccess
                      : styles.alertInfo,
                  ]}
                >
                  <Text
                    style={[
                      styles.alertText,
                      authMessage.type === 'error'
                        ? styles.alertErrorText
                        : authMessage.type === 'success'
                        ? styles.alertSuccessText
                        : styles.alertInfoText,
                    ]}
                  >
                    {authMessage.text}
                  </Text>
                </View>
              ) : null}

              {authTab === 'signup' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="e.g., Juan Dela Cruz"
                    placeholderTextColor="#94A3B8"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="student@ub.edu.ph"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={authTab === 'signin' ? handleSignIn : handleSignUp}
              >
                <Text style={styles.primaryBtnText}>
                  {authTab === 'signin' ? 'Sign In to Lipa City' : 'Create Student Account'}
                </Text>
              </TouchableOpacity>

              {authTab === 'signin' && (
                <TouchableOpacity style={styles.demoLinkBtn} onPress={handleAutoFillDemo}>
                  <Text style={styles.demoLinkText}>Tap to Auto-Fill Demo Account</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // =========================================================
  // PAGE 2: LIPA CITY SMART TOURISM DASHBOARD (MOCKUP LAYOUT)
  // =========================================================
  return (
    <SafeAreaView style={styles.dashSafe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.topHeader}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerAppTitle}>LipaConnect AI</Text>
            <Text style={styles.headerAppSub}>
              {'Smart Tourism • Welcome, ' + currentUser.name.split(' ')[0]}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutChip} onPress={handleLogout}>
            <Text style={styles.logoutChipText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Lipa places, lomi, barako, hikes..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.dashScroll}
        contentContainerStyle={styles.dashScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2x2 Tile Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[
                styles.tileCard,
                selectedCategory === 'Places' && styles.tileCardActiveBlue,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === 'Places' ? 'All' : 'Places')
              }
            >
              <View style={[styles.tileIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <Text style={styles.tileEmoji}>🏛️</Text>
              </View>
              <Text style={styles.tileLabel}>Best Places</Text>
              <Text style={styles.tileCount}>5 Spots</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tileCard,
                selectedCategory === 'Food' && styles.tileCardActiveAmber,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === 'Food' ? 'All' : 'Food')
              }
            >
              <View style={[styles.tileIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.tileEmoji}>🍜</Text>
              </View>
              <Text style={styles.tileLabel}>Best Food</Text>
              <Text style={styles.tileCount}>5 Spots</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[
                styles.tileCard,
                selectedCategory === 'Activities' && styles.tileCardActiveGreen,
              ]}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === 'Activities' ? 'All' : 'Activities'
                )
              }
            >
              <View style={[styles.tileIconWrap, { backgroundColor: '#D1FAE5' }]}>
                <Text style={styles.tileEmoji}>🧭</Text>
              </View>
              <Text style={styles.tileLabel}>Activities</Text>
              <Text style={styles.tileCount}>5 Things to Do</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tileCard, styles.tileCardAI]}
              onPress={() => setAiModalVisible(true)}
            >
              <View style={[styles.tileIconWrap, { backgroundColor: '#CCFBF1' }]}>
                <Text style={styles.tileEmoji}>🤖</Text>
              </View>
              <Text style={styles.tileLabel}>AI Assistant</Text>
              <Text style={styles.tileCountAI}>Ask Lipa Guide</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Hero Card */}
        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.9}
          onPress={() => setActiveSpot(LIPA_DATA[0])}
        >
          <View style={styles.heroBannerTop}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>FEATURED IN LIPA CITY</Text>
            </View>
            <Text style={styles.heroEmoji}>⛪</Text>
          </View>
          <Text style={styles.heroTitle}>San Sebastian Cathedral</Text>
          <Text style={styles.heroSub}>
            Explore the "Little Rome" & Coffee Capital of the Philippines • Tap for guide
          </Text>
        </TouchableOpacity>

        {/* Filter Status Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            {selectedCategory === 'All'
              ? 'All Lipa Highlights (' + filteredItems.length + ')'
              : 'Best ' + selectedCategory + ' in Lipa (' + filteredItems.length + ')'}
          </Text>
          {selectedCategory !== 'All' && (
            <TouchableOpacity onPress={() => setSelectedCategory('All')}>
              <Text style={styles.showAllLink}>Show All (15)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tourism Cards List */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No matching Lipa spots found</Text>
            <Text style={styles.emptySub}>Try clearing your search or category filter.</Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.spotCard}
              activeOpacity={0.85}
              onPress={() => setActiveSpot(item)}
            >
              <View style={[styles.spotIconBox, { backgroundColor: item.bgTint }]}>
                <Text style={styles.spotEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.spotBody}>
                <View style={styles.spotMetaRow}>
                  <Text style={[styles.spotBadge, { color: item.accent }]}>
                    {item.category.toUpperCase() + ' • ' + item.badge}
                  </Text>
                  <Text style={styles.spotRating}>{'★ ' + item.rating}</Text>
                </View>
                <Text style={styles.spotTitle}>{item.title}</Text>
                <Text style={styles.spotSub} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* SPOT DETAILS MODAL */}
      <Modal
        visible={!!activeSpot}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveSpot(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {activeSpot && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeaderRow}>
                  <View
                    style={[
                      styles.modalIconCircle,
                      { backgroundColor: activeSpot.bgTint },
                    ]}
                  >
                    <Text style={styles.modalIconEmoji}>{activeSpot.emoji}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeModalBtn}
                    onPress={() => setActiveSpot(null)}
                  >
                    <Text style={styles.closeModalText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalCategory, { color: activeSpot.accent }]}>
                  {activeSpot.category + ' • ' + activeSpot.badge}
                </Text>
                <Text style={styles.modalTitle}>{activeSpot.title}</Text>
                <Text style={styles.modalLocation}>{activeSpot.subtitle}</Text>

                <View style={styles.infoGrid}>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoPillLabel}>Hours</Text>
                    <Text style={styles.infoPillValue}>{activeSpot.hours}</Text>
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoPillLabel}>Estimated Cost</Text>
                    <Text style={styles.infoPillValue}>{activeSpot.fee}</Text>
                  </View>
                </View>

                <Text style={styles.modalSectionTitle}>About this Destination</Text>
                <Text style={styles.modalDesc}>{activeSpot.description}</Text>

                <View style={styles.tipBox}>
                  <Text style={styles.tipTitle}>💡 Local Lipa Tip</Text>
                  <Text style={styles.tipText}>{activeSpot.tips}</Text>
                </View>

                <TouchableOpacity
                  style={styles.modalDoneBtn}
                  onPress={() => setActiveSpot(null)}
                >
                  <Text style={styles.modalDoneText}>Back to Lipa Dashboard</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* LIPA AI TOURISM ASSISTANT MODAL */}
      <Modal
        visible={aiModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAiModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.aiModalCard}>
            <View style={styles.aiHeader}>
              <View>
                <Text style={styles.aiTitle}>🤖 LipaConnect AI Assistant</Text>
                <Text style={styles.aiSub}>Smart Lipa City Travel & Food Planner</Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setAiModalVisible(false)}
              >
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickPromptsRow}
            >
              <TouchableOpacity
                style={styles.promptChip}
                onPress={() => sendAiPrompt('1-Day Itinerary')}
              >
                <Text style={styles.promptChipText}>📅 1-Day Itinerary</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.promptChip}
                onPress={() => sendAiPrompt('Best Lomi & Barako')}
              >
                <Text style={styles.promptChipText}>🍜 Best Lomi & Barako</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.promptChip}
                onPress={() => sendAiPrompt('Must-Visit Places')}
              >
                <Text style={styles.promptChipText}>⛪ Must-Visit Places</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.promptChip}
                onPress={() => sendAiPrompt('Outdoor Activities')}
              >
                <Text style={styles.promptChipText}>⛰️ Activities</Text>
              </TouchableOpacity>
            </ScrollView>

            <ScrollView style={styles.aiChatScroll}>
              {aiMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.sender === 'user' ? styles.chatUser : styles.chatAi,
                  ]}
                >
                  <Text
                    style={
                      msg.sender === 'user' ? styles.chatUserText : styles.chatAiText
                    }
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.aiInputRow}>
              <TextInput
                style={styles.aiTextInput}
                placeholder="Ask about Lipa food, churches, hikes..."
                placeholderTextColor="#94A3B8"
                value={aiInput}
                onChangeText={setAiInput}
              />
              <TouchableOpacity
                style={styles.aiSendBtn}
                onPress={() => sendAiPrompt()}
              >
                <Text style={styles.aiSendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authSafe: {
    flex: 1,
    backgroundColor: '#F4F8FA',
  },
  authFlex: {
    flex: 1,
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  authBrandBox: {
    alignItems: 'center',
    marginBottom: 22,
  },
  brandIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandIconEmoji: {
    fontSize: 30,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 3,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  alertBox: {
    padding: 11,
    borderRadius: 12,
    marginBottom: 14,
  },
  alertError: {
    backgroundColor: '#FEE2E2',
  },
  alertSuccess: {
    backgroundColor: '#DCFCE7',
  },
  alertInfo: {
    backgroundColor: '#E0F2FE',
  },
  alertText: {
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  alertErrorText: {
    color: '#B91C1C',
  },
  alertSuccessText: {
    color: '#15803D',
  },
  alertInfoText: {
    color: '#0369A1',
  },
  inputGroup: {
    marginBottom: 13,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  primaryBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoLinkBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  demoLinkText: {
    color: '#0D9488',
    fontSize: 13,
    fontWeight: '700',
  },
  dashSafe: {
    flex: 1,
    backgroundColor: '#F4F8FA',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleBlock: {
    flex: 1,
  },
  headerAppTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  headerAppSub: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 1,
  },
  logoutChip: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  logoutChipText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  clearSearch: {
    fontSize: 14,
    color: '#64748B',
    paddingLeft: 8,
  },
  dashScroll: {
    flex: 1,
  },
  dashScrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  gridContainer: {
    marginBottom: 14,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tileCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tileCardActiveBlue: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  tileCardActiveAmber: {
    borderColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  tileCardActiveGreen: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  tileCardAI: {
    borderColor: '#99F6E4',
    backgroundColor: '#F0FDFA',
  },
  tileIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tileEmoji: {
    fontSize: 22,
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  tileCount: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  tileCountAI: {
    fontSize: 11.5,
    color: '#0D9488',
    fontWeight: '700',
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: '#0284C7',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroEmoji: {
    fontSize: 24,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 12.5,
    color: '#E0F2FE',
    marginTop: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  showAllLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  spotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  spotIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  spotEmoji: {
    fontSize: 24,
  },
  spotBody: {
    flex: 1,
  },
  spotMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  spotBadge: {
    fontSize: 10,
    fontWeight: '800',
  },
  spotRating: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#F59E0B',
  },
  spotTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  spotSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconEmoji: {
    fontSize: 28,
  },
  closeModalBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  modalCategory: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalLocation: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoPill: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoPillLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  infoPillValue: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 2,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 14,
  },
  tipBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
  },
  tipTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 3,
  },
  tipText: {
    fontSize: 12.5,
    color: '#0C4A6E',
    lineHeight: 18,
  },
  modalDoneBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalDoneText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  aiModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 18,
    height: '78%',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiSub: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '600',
  },
  quickPromptsRow: {
    maxHeight: 38,
    marginBottom: 10,
  },
  promptChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  aiChatScroll: {
    flex: 1,
    marginBottom: 10,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '88%',
  },
  chatAi: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
  },
  chatUser: {
    backgroundColor: '#0284C7',
    alignSelf: 'flex-end',
  },
  chatAiText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#0F172A',
  },
  chatUserText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTextInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
    marginRight: 8,
  },
  aiSendBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  aiSendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
});