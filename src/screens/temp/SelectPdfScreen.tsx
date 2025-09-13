import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { pick, types, keepLocalCopy } from '@react-native-documents/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../../../App';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context';

const HISTORY_KEY = 'PDF_HISTORY';

const SelectPdfScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  };

  const saveToHistory = async (item) => {
    try {
      const updated = [item, ...history.filter(h => h.uri !== item.uri)];
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save history:', e);
    }
  };

  const selectPdf = async () => {
    try {
      const res = await pick({ type: [types.pdf] });

      if (!res?.length) return;

      const { uri: fileUri, name = 'Unnamed.pdf' } = res[0];

      const [copyResult] = await keepLocalCopy({
        files: [{ uri: fileUri, fileName: name }],
        destination: 'cachesDirectory',
      });

      const localUri = copyResult.localUri;

      if (!localUri) throw new Error('Failed to copy file locally');

      const pdfItem = { uri: localUri, name };
      const item = { uri: fileUri, name };

      await saveToHistory(item);

      navigationRef.current?.navigate('ViewPdf', pdfItem);
    } catch (err) {
      if (err?.message?.includes('User canceled')) return;
      Alert.alert('Error', 'Could not open or process the selected PDF.');
    }
  };

  const openFromHistory = async (item) => {
    // alert(item.uri);
    const [copyResult] = await keepLocalCopy({
      files: [{ uri: item?.uri, fileName: item?.name }],
      destination: 'cachesDirectory',
    });

    console.log("Copy result:", copyResult);

    const localUri = copyResult?.localUri;

    // if (!localUri) throw new Error('Failed to copy file locally');

    console.log("Copy result2 :", localUri);
    const params = { uri: localUri, name: item?.name };
    navigationRef.current?.navigate('ViewPdf', params);
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => openFromHistory(item)}>
      <Text style={styles.historyText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {/* <Button title="Select PDF" onPress={selectPdf} /> */}
      {/*<Button title="Edit PDF" onPress={() => navigationRef.current?.navigate("PdfEditor")} /> */}
      <TouchableOpacity style={styles.item} onPress={selectPdf} activeOpacity={0.7}>
        <MaterialIcons name={"upload"} size={50} color="#4287f5" />
        <Text style={styles.title}>{"Select PDF from Device"}</Text>
      </TouchableOpacity>
      {history.length > 0 ? (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>📂 Recently Opened:</Text>
          <FlatList
            data={history}
            keyExtractor={(item) => item.uri}
            renderItem={renderHistoryItem}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📄</Text>
          <Text style={styles.emptyText}>No PDFs opened yet.</Text>
          <Text style={styles.emptySubText}>Tap "Select PDF" to choose a file.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SelectPdfScreen;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 20,
  // },
  historyContainer: {
    marginTop: 20,
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#1a1a1a"

  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 16,
    color: "#1a1a1a"

  },
  emptyState: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    color: "#1a1a1a"

  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
    color: "#1a1a1a"
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: "#1a1a1a"

  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1, backgroundColor: "#f5f5f5", padding: 20,

  },
  item: {
    width: "100%",
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
  },
  title: { fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: 10 },
});
