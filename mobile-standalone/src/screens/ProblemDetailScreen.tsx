import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
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

export default function ProblemDetailScreen({ route, navigation }: any) {
  const { problemId } = route.params;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  const difficultyNames = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움'
  };

  const subjectNames = {
    algebra: '대수학',
    calculus: '미적분',
    geometry: '기하',
    trigonometry: '삼각함수',
    probability: '확률',
    sequence: '수열'
  };

  const difficultyColors = {
    easy: { bg: '#d1fae5', text: '#065f46' },
    medium: { bg: '#fef3c7', text: '#92400e' },
    hard: { bg: '#fee2e2', text: '#991b1b' }
  };

  useEffect(() => {
    const foundProblem = problemsData.find(p => p.id === problemId);
    setProblem(foundProblem || null);
    
    navigation.setOptions({
      title: foundProblem?.title || '문제 풀이'
    });
  }, [problemId, navigation]);

  const handleSubmitAnswer = () => {
    if (!problem || !userAnswer.trim()) return;

    setAttempts(prev => prev + 1);
    
    // 간단한 답안 체크
    const normalizedUserAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
    const normalizedCorrectAnswer = problem.answer.toLowerCase().replace(/\s/g, '');
    
    const correct = normalizedUserAnswer.includes(normalizedCorrectAnswer) || 
                   normalizedCorrectAnswer.includes(normalizedUserAnswer);
    
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      Alert.alert(
        '정답입니다! 🎉',
        `${attempts + 1}번 만에 맞혔습니다. 훌륭해요!`,
        [{ text: '확인', style: 'default' }]
      );
    } else {
      Alert.alert(
        '오답입니다',
        '다시 한 번 시도해보세요.',
        [{ text: '확인', style: 'default' }]
      );
    }
  };

  const handleReset = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(null);
    setAttempts(0);
  };

  const handleShowHint = () => {
    Alert.alert(
      '힌트를 보시겠습니까?',
      '힌트를 보면 정답과 해설이 공개됩니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '힌트 보기', 
          onPress: () => setShowAnswer(true),
          style: 'default'
        }
      ]
    );
  };

  if (!problem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>문제를 찾을 수 없습니다</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 문제 정보 */}
        <View style={styles.problemInfo}>
          <View style={styles.badgeContainer}>
            <View style={[
              styles.badge,
              { backgroundColor: difficultyColors[problem.difficulty].bg }
            ]}>
              <Ionicons name="trophy-outline" size={14} color={difficultyColors[problem.difficulty].text} />
              <Text style={[
                styles.badgeText,
                { color: difficultyColors[problem.difficulty].text }
              ]}>
                {difficultyNames[problem.difficulty]}
              </Text>
            </View>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectBadgeText}>
                {subjectNames[problem.subject as keyof typeof subjectNames]}
              </Text>
            </View>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{problem.source}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{problem.year}년</Text>
            </View>
          </View>

          <Text style={styles.problemTitle}>{problem.title}</Text>
          <Text style={styles.problemContent}>{problem.content}</Text>

          <View style={styles.tagsContainer}>
            {problem.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 답안 입력 섹션 */}
        <View style={styles.answerSection}>
          <Text style={styles.sectionTitle}>답안 입력</Text>
          <Text style={styles.attemptsText}>시도: {attempts}번</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>당신의 답:</Text>
            <TextInput
              style={[styles.answerInput, showAnswer && styles.answerInputDisabled]}
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholder="답을 입력하세요..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              editable={!showAnswer}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!userAnswer.trim() || showAnswer) && styles.buttonDisabled
              ]}
              onPress={handleSubmitAnswer}
              disabled={!userAnswer.trim() || showAnswer}
            >
              <Text style={[
                styles.submitButtonText,
                (!userAnswer.trim() || showAnswer) && styles.buttonTextDisabled
              ]}>
                답안 제출
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.hintButton,
                showAnswer && styles.buttonDisabled
              ]}
              onPress={handleShowHint}
              disabled={showAnswer}
            >
              <Ionicons name="bulb-outline" size={16} color={showAnswer ? '#9ca3af' : '#f59e0b'} />
              <Text style={[
                styles.hintButtonText,
                showAnswer && styles.buttonTextDisabled
              ]}>
                힌트 보기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Ionicons name="refresh-outline" size={16} color="#6b7280" />
              <Text style={styles.resetButtonText}>다시 풀기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 정답 및 해설 */}
        {showAnswer && (
          <View style={styles.solutionSection}>
            {/* 결과 */}
            {isCorrect !== null && (
              <View style={[
                styles.resultCard,
                { backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2' }
              ]}>
                <View style={styles.resultHeader}>
                  <Ionicons 
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'} 
                    size={24} 
                    color={isCorrect ? '#059669' : '#dc2626'} 
                  />
                  <View style={styles.resultContent}>
                    <Text style={[
                      styles.resultTitle,
                      { color: isCorrect ? '#065f46' : '#991b1b' }
                    ]}>
                      {isCorrect ? '정답입니다!' : '오답입니다.'}
                    </Text>
                    <Text style={[
                      styles.resultSubtitle,
                      { color: isCorrect ? '#047857' : '#b91c1c' }
                    ]}>
                      {isCorrect 
                        ? `${attempts}번 만에 맞혔습니다. 훌륭해요!`
                        : '다시 한 번 시도해보세요.'
                      }
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* 정답 */}
            <View style={styles.answerCard}>
              <Text style={styles.cardTitle}>정답:</Text>
              <View style={styles.correctAnswerContainer}>
                <Text style={styles.correctAnswer}>{problem.answer}</Text>
              </View>
            </View>

            {/* 해설 */}
            <View style={styles.explanationCard}>
              <Text style={styles.cardTitle}>해설:</Text>
              <Text style={styles.explanationText}>{problem.explanation}</Text>
            </View>
          </View>
        )}

        {/* 비슷한 문제들 */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>비슷한 문제들</Text>
          {problemsData
            .filter(p => p.id !== problem.id && p.subject === problem.subject)
            .slice(0, 3)
            .map((relatedProblem) => (
              <TouchableOpacity
                key={relatedProblem.id}
                style={styles.relatedProblemCard}
                onPress={() => navigation.push('ProblemDetail', { problemId: relatedProblem.id })}
              >
                <Text style={styles.relatedProblemTitle} numberOfLines={2}>
                  {relatedProblem.title}
                </Text>
                <View style={styles.relatedProblemMeta}>
                  <View style={[
                    styles.relatedBadge,
                    { backgroundColor: difficultyColors[relatedProblem.difficulty].bg }
                  ]}>
                    <Text style={[
                      styles.relatedBadgeText,
                      { color: difficultyColors[relatedProblem.difficulty].text }
                    ]}>
                      {difficultyNames[relatedProblem.difficulty]}
                    </Text>
                  </View>
                  <Text style={styles.relatedProblemSource}>
                    {relatedProblem.source} {relatedProblem.year}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  problemInfo: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
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
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  problemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 28,
  },
  problemContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#6b7280',
  },
  answerSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  attemptsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  answerInputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 12,
  },
  hintButtonText: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  resetButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  solutionSection: {
    gap: 16,
    marginHorizontal: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
  },
  answerCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  correctAnswerContainer: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
  },
  correctAnswer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    fontFamily: 'monospace',
  },
  explanationCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  explanationText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  relatedSection: {
    margin: 20,
    marginTop: 0,
  },
  relatedProblemCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  relatedProblemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  relatedProblemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  relatedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  relatedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  relatedProblemSource: {
    fontSize: 12,
    color: '#6b7280',
  },
});