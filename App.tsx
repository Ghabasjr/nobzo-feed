import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';


type FeedItem = {
  id: string;
  author: string;
  download_url: string;
}

const Range = 20

export default function App() {

  const [data, setData] = useState<FeedItem[]>([])
  const [page, setPage] = useState(1)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchFeed = async (page: number, isRefresh = false) => {
    try {
      setError(null);
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${Range}`);
      if (!response.ok) throw new Error("Failed to fetch feed");
      const result: FeedItem[] = await response.json();

      if (isRefresh) {
        setData(result);
      } else {
        setData(prev => [...prev, ...result]);
      }
      if (result.length < Range) { setHasMore(false); }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingInitial(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchFeed(1);
  }, []);

  const loadMore = () => {
    if (loadingMore || loadingInitial || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    fetchFeed(1, true);
  };

  const retry = () => {
    setLoadingInitial(true);
    fetchFeed(1);
  };

  const renderItem = ({ item }: { item: FeedItem }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.download_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.meta}>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.id}>ID: {item.id}</Text>
      </View>
    </View>
  );

  if (loadingInitial) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading feed...</Text>
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={retry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!loadingInitial && data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No items found.</Text>
      </View>
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Feed</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size={50} style={{ margin: 16 }} /> : null
        }
      />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 26,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16
  },
  card: {
    backgroundColor: "#fff",
    // marginHorizontal: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    width: width * 0.9,
  },
  image: {
    width: 'auto',
    height: width * 0.6,
  },
  meta: {
    padding: 12,
  },
  author: {
    fontSize: 16,
    fontWeight: "600",
  },
  id: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtn: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
  },
});
