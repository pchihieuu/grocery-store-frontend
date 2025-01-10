import BaseScreen from "@/src/components/BaseScreen";
import MyInput from "@/src/components/ui/MyInput";
import OfferCard from "@/src/components/Product/OfferCard";
import ProductCard from "@/src/components/Product/ProductCard";
import Tabs from "@/src/components/ui/Tabs";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { DatePickerIOSBase } from "react-native";
import { GET_CATEGORIES } from "@/src/Query/category";
import { GET_PRODUCT_BY_CATEGORY } from "@/src/Query/product";

const GET_PRODUCTS = gql`
  {
    products(search: "") {
      items {
        name
        image {
          url
        }
      }
    }
  }
`;

const HomeScreen = () => {
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState();
  const [cateProducts, setCateProducts] = useState([]);

  const { loading, error, data } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    if (data) {
      setTabs(data.category.children);
      setSelectedTab(data.category.children[0]);
    } else {
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedTab) {
      setCateProducts(selectedTab.products.items);
    }
  }, [selectedTab]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} />
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <BaseScreen
      title="Welcome"
      subtitle="Find and order your fresh fruits & vegetables"
    >
      <View style={styles.container}>
        <MyInput placeholder={"Search fresh fruits & vegetables..."} />
        <Tabs tabs={tabs} activeTab={selectedTab} onPress={setSelectedTab} />
        <ScrollView
          horizontal
          style={styles.productContainer}
          showsHorizontalScrollIndicator={false}
        >
          {cateProducts &&
            cateProducts.map((p) => (
              <View style={styles.card} key={p.id}>
                <ProductCard
                  imgUrl={"https://cdn.tgdd.vn/2020/08/content/1-800x814-1.jpg"}
                  name={p.name}
                  price={p.price_range.minimum_price.final_price}
                />
              </View>
            ))}
        </ScrollView>
        <TouchableOpacity title="See All" style={styles.allBtn}>
          <Text style={styles.textBtn}>See All</Text>
        </TouchableOpacity>
        <Text style={styles.textOffer}>Todays Offers {DatePickerIOSBase}</Text>
        <View style={styles.offerContainer}>
          <OfferCard />
          <OfferCard />
          <OfferCard />
          <OfferCard />
          <OfferCard />
          <OfferCard />
        </View>
      </View>
    </BaseScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
  },
  card: {
    marginRight: 16,
  },
  allBtn: {
    padding: 8,
    borderColor: "#333",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 40,
    width: 180,
    marginVertical: 16,
  },
  textBtn: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  textOffer: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
  },
  productContainer: {
    // marginTop: 10,
    // height: "auto",
  },
  offerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});
