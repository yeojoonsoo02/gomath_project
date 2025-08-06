import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface VisualizerTool {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: string;
}

const visualizerTools: VisualizerTool[] = [
  {
    id: '1',
    title: '함수 그래프',
    description: '다양한 함수의 그래프를 그리고 분석해보세요',
    icon: 'trending-up',
    color: '#3b82f6',
    category: 'function',
  },
  {
    id: '2',
    title: '도형 그리기',
    description: '2D/3D 도형을 생성하고 속성을 확인하세요',
    icon: 'shapes',
    color: '#10b981',
    category: 'geometry',
  },
  {
    id: '3',
    title: '확률 시뮬레이션',
    description: '확률 실험을 시뮬레이션하고 결과를 확인하세요',
    icon: 'dice',
    color: '#f59e0b',
    category: 'probability',
  },
  {
    id: '4',
    title: '벡터 계산기',
    description: '벡터의 덧셈, 내적, 외적을 시각화하세요',
    icon: 'arrow-forward',
    color: '#ef4444',
    category: 'vector',
  },
  {
    id: '5',
    title: '행렬 연산',
    description: '행렬의 곱셈, 역행렬 등을 시각적으로 이해하세요',
    icon: 'grid',
    color: '#8b5cf6',
    category: 'matrix',
  },
  {
    id: '6',
    title: '미적분 시각화',
    description: '도함수와 적분의 기하학적 의미를 확인하세요',
    icon: 'analytics',
    color: '#06b6d4',
    category: 'calculus',
  },
];

const categories = [
  { id: 'all', label: '전체', icon: 'apps' as const },
  { id: 'function', label: '함수', icon: 'trending-up' as const },
  { id: 'geometry', label: '기하', icon: 'shapes' as const },
  { id: 'probability', label: '확률', icon: 'dice' as const },
  { id: 'calculus', label: '미적분', icon: 'analytics' as const },
];

const VisualizerCard: React.FC<{ tool: VisualizerTool }> = ({ tool }) => (
  <TouchableOpacity style={[styles.toolCard, { width: (width - 48) / 2 }]}>
    <View style={[styles.toolIconContainer, { backgroundColor: tool.color }]}>
      <Ionicons name={tool.icon} size={32} color="white" />
    </View>
    <Text style={styles.toolTitle} numberOfLines={1}>
      {tool.title}
    </Text>
    <Text style={styles.toolDescription} numberOfLines={2}>
      {tool.description}
    </Text>
    <TouchableOpacity style={styles.startButton}>
      <Text style={styles.startButtonText}>시작하기</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const VisualizerScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = selectedCategory === 'all' 
    ? visualizerTools 
    : visualizerTools.filter(tool => tool.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>시각화 도구</Text>
          <Text style={styles.headerDescription}>
            수학 개념을 시각적으로 이해해보세요
          </Text>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? 'white' : '#6b7280'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>빠른 시작</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="calculator" size={24} color="#3b82f6" />
              <Text style={styles.quickActionText}>계산기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="camera" size={24} color="#10b981" />
              <Text style={styles.quickActionText}>수식 스캔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="create" size={24} color="#f59e0b" />
              <Text style={styles.quickActionText}>그래프 그리기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tools Grid */}
        <View style={styles.toolsContainer}>
          <Text style={styles.sectionTitle}>
            도구 ({filteredTools.length}개)
          </Text>
          <View style={styles.toolsGrid}>
            {filteredTools.map((tool) => (
              <VisualizerCard key={tool.id} tool={tool} />
            ))}
          </View>
        </View>

        {/* Recent Usage */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>최근 사용</Text>
          <View style={styles.recentItem}>
            <View style={styles.recentIconContainer}>
              <Ionicons name="trending-up" size={20} color="#3b82f6" />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>2차 함수 그래프</Text>
              <Text style={styles.recentTime}>2시간 전</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <View style={styles.recentItem}>
            <View style={styles.recentIconContainer}>
              <Ionicons name="shapes" size={20} color="#10b981" />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>원의 방정식</Text>
              <Text style={styles.recentTime}>1일 전</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
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
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: '#6b7280',
  },
  categoriesContainer: {
    maxHeight: 80,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  activeCategoryButton: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: 'white',
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: (width - 64) / 3,
  },
  quickActionText: {
    fontSize: 12,
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
  },
  toolsContainer: {
    padding: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  toolCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  toolIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  startButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
  },
  recentContainer: {
    padding: 20,
  },
  recentItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  recentTime: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default VisualizerScreen;