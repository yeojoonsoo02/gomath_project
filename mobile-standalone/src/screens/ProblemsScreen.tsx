import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import problemsData from '../data/problems.json';

interface Problem {
  id: string;
  title: string;
  content: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
  answer: string;
  explanation: string;
  tags: string[];
  source: string;
  year: number;
}

export default function ProblemsScreen({ navigation }: any) {
  const [problems, setProblems] = useState<Problem[]>(problemsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>(problemsData);

  const subjects = ['all', 'algebra', 'calculus', 'geometry', 'trigonometry', 'probability', 'sequence'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const subjectNames = {
    all: '전체',
    algebra: '대수학',
    calculus: '미적분',
    geometry: '기하',
    trigonometry: '삼각함수',
    probability: '확률',
    sequence: '수열'
  };

  const difficultyNames = {
    all: '전체',
    easy: '쉬움',
    medium: '보통',
    hard: '어려움'
  };

  const difficultyColors = {
    easy: { bg: '#d1fae5', text: '#065f46' },
    medium: { bg: '#fef3c7', text: '#92400e' },
    hard: { bg: '#fee2e2', text: '#991b1b' }
  };

  useEffect(() => {
    let filtered = problems;

    // 검색 필터링
    if (searchQuery) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 과목 필터링
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(problem => problem.subject === selectedSubject);
    }

    // 난이도 필터링
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }

    setFilteredProblems(filtered);
  }, [searchQuery, selectedSubject, selectedDifficulty, problems]);

  const renderProblemCard = ({ item }: { item: Problem }) => (
    <TouchableOpacity
      style={styles.problemCard}
      onPress={() => navigation.navigate('ProblemDetail', { problemId: item.id })}
    >
      <View style={styles.problemHeader}>
        <View style={styles.badgeContainer}>
          <View style={[
            styles.badge,
            {
              backgroundColor: difficultyColors[item.difficulty].bg,
            }
          ]}>
            <Text style={[
              styles.badgeText,
              { color: difficultyColors[item.difficulty].text }
            ]}>
              {difficultyNames[item.difficulty as keyof typeof difficultyNames]}
            </Text>
          </View>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectBadgeText}>
              {subjectNames[item.subject as keyof typeof subjectNames]}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.problemTitle} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.problemContent} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.problemFooter}>
        <View style={styles.problemInfo}>
          <Ionicons name="book-outline" size={14} color="#6b7280" />
          <Text style={styles.problemInfoText}>{item.source}</Text>
        </View>
        <View style={styles.problemInfo}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.problemInfoText}>{item.year}년</Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {item.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
        {item.tags.length > 3 && (
          <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>수학 문제</Text>
      </View>

      {/* 검색 및 필터 섹션 */}
      <View style={styles.filterSection}>
        {/* 검색바 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="문제 제목, 내용, 태그로 검색..."
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* 필터 버튼들 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <View style={styles.filterRow}>
            {subjects.map(subject => (
              <TouchableOpacity
                key={subject}
                style={[
                  styles.filterButton,
                  selectedSubject === subject && styles.filterButtonActive
                ]}
                onPress={() => setSelectedSubject(subject)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedSubject === subject && styles.filterButtonTextActive
                ]}>
                  {subjectNames[subject as keyof typeof subjectNames]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {difficulties.map(difficulty => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  selectedDifficulty === difficulty && styles.filterButtonActive
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedDifficulty === difficulty && styles.filterButtonTextActive
                ]}>
                  {difficultyNames[difficulty as keyof typeof difficultyNames]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 결과 개수 */}
      <View style={styles.resultInfo}>
        <Text style={styles.resultText}>
          <Text style={styles.resultCount}>{filteredProblems.length}개</Text>의 문제를 찾았습니다
        </Text>
      </View>

      {/* 문제 목록 */}
      {filteredProblems.length > 0 ? (
        <FlatList
          data={filteredProblems}
          renderItem={renderProblemCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
          <Text style={styles.emptySubtitle}>다른 검색어나 필터를 사용해보세요.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterSection: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterScrollView: {
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  resultInfo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultCount: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  listContainer: {
    padding: 20,
  },
  problemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subjectBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  problemContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  problemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  problemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  problemInfoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});