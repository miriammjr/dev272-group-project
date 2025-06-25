import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  textMuted: {
    color: '#6B7280',
  },
  textBold: {
    fontWeight: 'bold',
  },
  rounded: {
    borderRadius: 8,
  },
  centerAligned: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  greetingText: {
    fontSize: 26,
    ...sharedStyles.textBold,
  },
  subGreetingText: {
    fontSize: 16,
    ...sharedStyles.textMuted,
    marginTop: 4,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  statCard: {
    ...sharedStyles.centerAligned,
    backgroundColor: '#F9FAFB',
    padding: 8,
    ...sharedStyles.rounded,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 22,
    ...sharedStyles.textBold,
    color: '#111827',
  },
  overdueText: {
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 14,
    ...sharedStyles.textMuted,
    marginTop: 2,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },

  section: {
    ...sharedStyles.card,
    marginVertical: 4,
    marginLeft: 8,
    marginRight: 8
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  taskCountBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  taskCountText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 12,
  },

  emptyText: {
    fontStyle: 'italic',
    ...sharedStyles.textMuted,
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },

  calendar: {
    marginTop: 12,
    ...sharedStyles.rounded,
    overflow: 'hidden',
  },

  addButtonBottom: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Forecast screen
  filterButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  filterActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    color: '#111827',
    fontSize: 13,
  },
  loader: {
    marginTop: 20,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },

  // Shop screen
  shopEmptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    ...sharedStyles.textMuted,
  },
  shopCard: {
    ...sharedStyles.card,
    borderRadius: 10,
    marginBottom: 16,
    ...sharedStyles.shadow,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 20,
    color: '#DC2626',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
  },
  linkButton: {
    paddingVertical: 6,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 16,
  },

  // TaskCard
  taskCard: {
    ...sharedStyles.card,
    marginVertical: 8,
    marginHorizontal: 0,
    ...sharedStyles.shadow,
  },
  taskCardName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  taskCardText: {
    fontSize: 14,
    ...sharedStyles.textMuted,
  },

  // TaskCardToggle
  taskToggleCard: {
    ...sharedStyles.card,
    marginHorizontal: 0,
    marginVertical: 8,
    ...sharedStyles.shadow,
  },
  taskToggleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  taskToggleDue: {
    fontSize: 14,
    ...sharedStyles.textMuted,
    marginVertical: 4,
  },
  taskToggleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});