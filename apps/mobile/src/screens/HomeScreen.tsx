import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  color, 
  onPress 
}) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="white" />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const features = [
    {
      icon: 'search' as const,
      title: '기출문제 검색',
      description: '수능, 공무원 등 다양한 기출문제를 검색하세요',
      color: '#3b82f6',
      onPress: () => console.log('Navigate to search'),
    },
    {
      icon: 'analytics' as const,
      title: '시각화 도구',
      description: '그래프와 애니메이션으로 수학을 이해하세요',
      color: '#10b981',
      onPress: () => console.log('Navigate to visualizer'),
    },
    {
      icon: 'camera' as const,
      title: '문제 스캔',
      description: '카메라로 문제를 스캔하여 바로 해결하세요',
      color: '#f59e0b',
      onPress: () => console.log('Navigate to scanner'),
    },
    {
      icon: 'trending-up' as const,
      title: '학습 진도',
      description: '나의 학습 패턴과 진도를 확인하세요',
      color: '#ef4444',
      onPress: () => console.log('Navigate to progress'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.heroSection}
        >
          <Text style={styles.welcomeText}>안녕하세요! 👋</Text>
          <Text style={styles.heroTitle}>
            수학을 시각적으로{'\n'}학습해보세요
          </Text>
          <Text style={styles.heroDescription}>
            기출문제와 인터랙티브 시각화를 통해{'\n'}
            수학의 본질을 이해하세요
          </Text>
          
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>학습 시작하기</Text>
            <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>문제 풀이</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>87%</Text>
            <Text style={styles.statLabel}>정답률</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>연속 학습</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>주요 기능</Text>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              onPress={feature.onPress}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>최근 활동</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Ionicons name="time" size={20} color="#6b7280" />
              <Text style={styles.activityTime}>2시간 전</Text>
            </View>
            <Text style={styles.activityTitle}>미분 단원 학습 완료</Text>
            <Text style={styles.activityDescription}>
              도함수의 정의와 미분 공식을 학습했습니다.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  heroSection: {
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    lineHeight: 36,
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statItem: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default HomeScreen;