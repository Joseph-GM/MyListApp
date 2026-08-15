import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Props {
  visible: boolean;
  showUrlField?: boolean;
  titleLabel?: string;
  initialTitle?: string;
  initialUrl?: string;
  onClose: () => void;
  onSubmit: (title: string, url?: string) => void;
}

export default function AddItemModal({
  visible,
  showUrlField,
  titleLabel = '제목',
  initialTitle = '',
  initialUrl = '',
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setUrl(initialUrl);
    }
  }, [visible, initialTitle, initialUrl]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title, url);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.label}>{titleLabel}</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={`${titleLabel}을 입력하세요`}
            autoFocus
          />

          {showUrlField && (
            <>
              <Text style={styles.label}>지도 URL (선택)</Text>
              <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="네이버/구글 지도 링크 붙여넣기"
                autoCapitalize="none"
              />
            </>
          )}

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={styles.btnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={handleSubmit}>
              <Text style={[styles.btnText, { color: '#fff' }]}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  label: { fontSize: 13, color: '#666', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  row: { flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end' },
  btn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, marginLeft: 8 },
  cancel: { backgroundColor: '#f0f0f0' },
  confirm: { backgroundColor: '#2f6fed' },
  btnText: { fontSize: 15, fontWeight: '600', color: '#333' },
});