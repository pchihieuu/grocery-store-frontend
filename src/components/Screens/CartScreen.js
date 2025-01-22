import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  GestureHandlerRootView,
  Swipeable,
  RectButton,
} from "react-native-gesture-handler";
import {
  GET_CUSTOMER_CART,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_ITEM_FROM_CART,
} from "@/src/Query/cart";
import { useQuery, useMutation } from "@apollo/client";
import CartStyles from "@/src/styles/CartStyles";
import { IMAGE_URL_DOMAIN, BASE_IMAGE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

const CART_CACHE_KEY = "cart_data_cache";
const CART_CACHE_TIMESTAMP = "cart_cache_timestamp";

const EmptyCart = React.memo(({ onShopNow }) => (
  <View style={CartStyles.emptyContainer}>
    <View style={CartStyles.emptyContent}>
      <Ionicons
        name="cart-outline"
        size={120}
        color="#CCCCCC"
        style={CartStyles.emptyIcon}
      />
      <Text style={CartStyles.emptyTitle}>Your cart is empty</Text>
      <Text style={CartStyles.emptyText}>
        Looks like you haven't added anything to your cart yet
      </Text>
      <TouchableOpacity style={CartStyles.shopNowButton} onPress={onShopNow}>
        <Text style={CartStyles.shopNowButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const CartItem = React.memo(
  ({ item, onQuantityChange, onRemove, renderRightActions }) => {
    const fixedImageUrl = useMemo(
      () =>
        item.product.image.url
          .toString()
          .replace(BASE_IMAGE_URL, IMAGE_URL_DOMAIN),
      [item.product.image.url],
    );

    const selectedOptions = useMemo(() => {
      const options = [];

      if (item.configurable_options?.length > 0) {
        item.configurable_options.forEach((option) => {
          options.push(
            <Text key={option.option_label} style={CartStyles.optionText}>
              {option.option_label}: {option.value_label}
            </Text>,
          );
        });
      }

      if (item.customizable_options?.length > 0) {
        item.customizable_options.forEach((option) => {
          options.push(
            <Text key={option.label} style={CartStyles.optionText}>
              {option.label}: {option.values[0]?.label}
            </Text>,
          );
        });
      }

      return options;
    }, [item.configurable_options, item.customizable_options]);

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item.id)
        }
        rightThreshold={-80}
        overshootRight={false}
      >
        <View style={CartStyles.itemCard}>
          <Image source={{ uri: fixedImageUrl }} style={CartStyles.itemImage} />
          <View style={CartStyles.itemInfo}>
            <Text style={CartStyles.itemName}>{item.product.name}</Text>
            {selectedOptions.length > 0 && (
              <View style={CartStyles.optionsContainer}>{selectedOptions}</View>
            )}
            <Text style={CartStyles.itemPrice}>
              ${item.product.price_range.minimum_price.regular_price.value}
            </Text>
          </View>
          <View style={CartStyles.quantityControls}>
            <TouchableOpacity
              style={CartStyles.quantityButton}
              onPress={() => onQuantityChange(item.id, item.quantity - 1)}
            >
              <Text style={CartStyles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={CartStyles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={CartStyles.quantityButton}
              onPress={() => onQuantityChange(item.id, item.quantity + 1)}
            >
              <Text style={CartStyles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    );
  },
);

const CartScreen = ({ navigation }) => {
  const [localCart, setLocalCart] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_CUSTOMER_CART, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    onError: handleCartError,
  });

  const [updateQuantity] = useMutation(UPDATE_CART_ITEM_QUANTITY);
  const [removeItem] = useMutation(REMOVE_ITEM_FROM_CART);

  const calculateTotal = useCallback((items) => {
    if (!items) return 0;
    return items.reduce((sum, item) => {
      const itemPrice =
        item.product.price_range.minimum_price.regular_price.value;
      return sum + itemPrice * item.quantity;
    }, 0);
  }, []);

  const clearCartData = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(CART_CACHE_KEY),
        AsyncStorage.removeItem(CART_CACHE_TIMESTAMP),
        AsyncStorage.removeItem("@shopping_cart_id"),
      ]);
      setLocalCart(null);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error clearing cart data:", error);
    }
  }, []);

  const handleCartError = useCallback(
    async (error) => {
      console.error("Cart error:", error);
      if (
        error.message.includes(
          "The current user cannot perform operations on cart",
        ) ||
        error.message.includes("Could not find a cart") ||
        error.message.includes("The cart isn't active")
      ) {
        await clearCartData();

        Alert.alert(
          "Session Expired",
          "Your shopping session has expired. Please try again.",
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  await refetch();
                } catch (refetchError) {
                  console.error("Refetch error:", refetchError);
                }
              },
            },
          ],
        );
      }
    },
    [clearCartData, refetch],
  );

  const updateCartCache = useCallback(async (cartData) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(cartData)),
        AsyncStorage.setItem(CART_CACHE_TIMESTAMP, Date.now().toString()),
      ]);
    } catch (error) {
      console.error("Error caching cart data:", error);
    }
  }, []);

  const handleShopNow = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const refreshCart = async () => {
        setIsRefreshing(true);
        try {
          const cartId = await AsyncStorage.getItem("@shopping_cart_id");
          if (!cartId) {
            await clearCartData();
            setIsRefreshing(false);
            return;
          }

          const result = await refetch();
          if (result.data) {
            await updateCartCache(result.data);
            setLocalCart(result.data);
            setTotalAmount(calculateTotal(result.data?.customerCart?.items));
          }
        } catch (err) {
          await handleCartError(err);
        } finally {
          setIsRefreshing(false);
        }
      };

      refreshCart();
    }, [
      clearCartData,
      refetch,
      updateCartCache,
      calculateTotal,
      handleCartError,
    ]),
  );

  const handleQuantityChange = useCallback(
    async (itemId, quantity) => {
      if (quantity === 0) {
        await handleRemoveItem(itemId);
        return;
      }

      try {
        const currentCart = localCart || data;
        if (!currentCart?.customerCart?.id) {
          throw new Error("No active cart found");
        }

        const updatedItems = currentCart.customerCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        );

        const updatedCart = {
          ...currentCart,
          customerCart: {
            ...currentCart.customerCart,
            items: updatedItems,
          },
        };

        setTotalAmount(calculateTotal(updatedItems));
        setLocalCart(updatedCart);
        await updateCartCache(updatedCart);

        await updateQuantity({
          variables: {
            cartId: currentCart.customerCart.id,
            cartItemId: parseInt(itemId),
            quantity: quantity,
          },
        });
      } catch (error) {
        await handleCartError(error);
      }
    },
    [
      localCart,
      data,
      calculateTotal,
      updateCartCache,
      updateQuantity,
      handleCartError,
    ],
  );

  const handleRemoveItem = useCallback(
    async (itemId) => {
      try {
        const currentCart = localCart || data;
        if (!currentCart?.customerCart?.id) {
          throw new Error("No active cart found");
        }

        const updatedItems = currentCart.customerCart.items.filter(
          (item) => item.id !== itemId,
        );

        const updatedCart = {
          ...currentCart,
          customerCart: {
            ...currentCart.customerCart,
            items: updatedItems,
          },
        };

        setTotalAmount(calculateTotal(updatedItems));
        setLocalCart(updatedCart);
        await updateCartCache(updatedCart);

        await removeItem({
          variables: {
            cartId: currentCart.customerCart.id,
            cartItemId: parseInt(itemId),
          },
        });
      } catch (error) {
        await handleCartError(error);
      }
    },
    [
      localCart,
      data,
      calculateTotal,
      updateCartCache,
      removeItem,
      handleCartError,
    ],
  );

  const renderRightActions = useCallback(
    (progress, dragX, itemId) => {
      const trans = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [0, 80],
        extrapolate: "clamp",
      });
      const opacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
      });

      return (
        <RectButton
          style={CartStyles.deleteButton}
          onPress={() => handleRemoveItem(itemId)}
        >
          <Animated.View
            style={[
              CartStyles.deleteButtonContainer,
              {
                opacity,
                transform: [{ translateX: trans }],
              },
            ]}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </Animated.View>
        </RectButton>
      );
    },
    [handleRemoveItem],
  );

  const cartData = localCart || data;
  const cartItems = cartData?.customerCart?.items || [];

  const renderContent = useMemo(() => {
    if ((loading || isRefreshing) && !localCart) {
      return (
        <View style={CartStyles.loadingContainer}>
          <Text>Loading cart...</Text>
        </View>
      );
    }

    if (error && !cartData?.customerCart?.items) {
      return (
        <View style={CartStyles.errorContainer}>
          <Text>Unable to load cart</Text>
          <TouchableOpacity
            style={CartStyles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={CartStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!loading && cartItems.length === 0) {
      return <EmptyCart onShopNow={handleShopNow} />;
    }

    return (
      <>
        <ScrollView style={CartStyles.itemsContainer}>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              renderRightActions={renderRightActions}
            />
          ))}
        </ScrollView>

        <View style={CartStyles.footer}>
          <View style={CartStyles.totalContainer}>
            <Text style={CartStyles.totalLabel}>Total: </Text>
            <Text style={CartStyles.totalAmount}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={CartStyles.continueButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={CartStyles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }, [
    loading,
    isRefreshing,
    localCart,
    error,
    cartData,
    cartItems,
    handleShopNow,
    handleQuantityChange,
    handleRemoveItem,
    renderRightActions,
    totalAmount,
    navigation,
    refetch,
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={CartStyles.container}>
        <View style={CartStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={CartStyles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={CartStyles.headerTitle}>Shopping Cart</Text>
          <Text style={CartStyles.itemCount}>
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </Text>
        </View>
        {renderContent}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default React.memo(CartScreen);
