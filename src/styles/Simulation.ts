const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16
  },
  error: { color: 'crimson', marginTop: 6 },
  btn: {
    backgroundColor: '#111', paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center'
  },
  btnSecondary: {
    backgroundColor: 'transparent', borderWidth: 1, borderColor: '#111'
  },
  btnDisabled: { opacity: 0.5 },
  btnPressed: { opacity: 0.8 },
  btnText: { color: 'white', fontWeight: '700' },
  btnTextSecondary: { color: '#111' },
  card: {
    padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    backgroundColor: 'white'
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { marginTop: 4, opacity: 0.7 },
  resultBox: {
    marginTop: 8, padding: 14, borderRadius: 10,
    backgroundColor: '#F6F7F9', borderWidth: 1, borderColor: '#E7E9EE',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  resultLabel: { fontSize: 14, fontWeight: '600' },
  resultValue: { fontSize: 18, fontWeight: '800' },
});