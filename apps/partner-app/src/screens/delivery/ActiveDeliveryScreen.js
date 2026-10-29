import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDelivery } from '../../context/DeliveryContext';
import { colors } from '../../theme/colors';

export default function ActiveDeliveryScreen({ navigation }) {
  const { activeTask, pickupOrder, deliverOrder } = useDelivery();
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!activeTask) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bicycle-outline" size={64} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No Active Delivery Trip</Text>
        <Text style={styles.emptySub}>
          Head over to the Duty Dashboard to accept incoming pet delivery orders!
        </Text>
        <TouchableOpacity
          style={styles.goDashboardBtn}
          onPress={() => navigation.navigate('DutyTab')}
        >
          <Text style={styles.goDashboardText}>View Available Trips</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDeliver = () => {
    if (!otpInput) {
      setErrorMsg('Please enter customer 4-digit OTP');
      return;
    }
    const res = deliverOrder(otpInput);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      Alert.alert('Trip Completed! 🎉', 'Order marked as Delivered. ₹85 credited to your rider wallet.');
      navigation.navigate('DutyTab');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Active Delivery Trip</Text>
          <Text style={styles.headerSubtitle}>Order {activeTask.orderId}</Text>
        </View>
        <View style={styles.payoutBadge}>
          <Text style={styles.payoutText}>{activeTask.estimatedFee}</Text>
        </View>
      </View>

      {/* Stage Tracker */}
      <View style={styles.stageCard}>
        <View style={styles.stageRow}>
          <View style={[styles.stageDot, styles.dotDone]}>
            <Ionicons name="checkmark" size={12} color={colors.white} />
          </View>
          <View style={[styles.stageLine, activeTask.status === 'picked_up' && styles.lineDone]} />
          <View style={[styles.stageDot, activeTask.status === 'picked_up' && styles.dotDone]}>
            <Ionicons name={activeTask.status === 'picked_up' ? "checkmark" : "bicycle"} size={12} color={colors.white} />
          </View>
          <View style={styles.stageLine} />
          <View style={styles.stageDot}>
            <Ionicons name="flag" size={12} color={colors.textMuted} />
          </View>
        </View>
        <View style={styles.stageLabels}>
          <Text style={styles.stageLabel}>Store Pickup</Text>
          <Text style={styles.stageLabel}>In Transit</Text>
          <Text style={styles.stageLabel}>Drop-off</Text>
        </View>
      </View>

      {/* Step 1: Store Pickup */}
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumberBadge}>
            <Text style={styles.stepNum}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Pick Up Package from Store</Text>
        </View>

        <Text style={styles.nameText}>{activeTask.pickupStore}</Text>
        <Text style={styles.addressText}>{activeTask.pickupAddress}</Text>

        {activeTask.status === 'assigned' ? (
          <TouchableOpacity
            style={styles.pickupActionBtn}
            onPress={pickupOrder}
          >
            <Ionicons name="cube" size={16} color={colors.white} />
            <Text style={styles.actionBtnText}>Confirm Store Pickup</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedTag}>
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            <Text style={styles.completedTagText}>Package Collected from Store</Text>
          </View>
        )}
      </View>

      {/* Step 2: Customer Drop-off & OTP */}
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepNumberBadge, { backgroundColor: colors.delivery }]}>
            <Text style={styles.stepNum}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Deliver to Pet Parent</Text>
        </View>

        <View style={styles.customerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>{activeTask.customerName}</Text>
            <Text style={styles.addressText}>{activeTask.dropAddress}</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.paymentNote}>
          <Ionicons name="cash" size={16} color={colors.accent} />
          <Text style={styles.paymentNoteText}>{activeTask.paymentType}</Text>
        </View>

        {/* OTP Input Form */}
        <View style={styles.otpCard}>
          <Text style={styles.otpHeading}>Customer Delivery OTP</Text>
          <Text style={styles.otpHint}>Ask customer for the 4-digit code shown on their tracking screen</Text>
          <TextInput
            style={styles.otpInput}
            placeholder="e.g. 4821"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={6}
            value={otpInput}
            onChangeText={(val) => {
              setOtpInput(val);
              setErrorMsg('');
            }}
          />
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity
            style={styles.completeBtn}
            onPress={handleDeliver}
          >
            <Ionicons name="checkmark-done" size={18} color={colors.white} />
            <Text style={styles.completeBtnText}>Verify OTP & Complete Delivery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  payoutBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  payoutText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#22C55E',
  },
  stageCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: colors.delivery,
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.surfaceBorder,
    marginHorizontal: 8,
  },
  lineDone: {
    backgroundColor: colors.delivery,
  },
  stageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stageLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.vendor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.white,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 4,
  },
  pickupActionBtn: {
    backgroundColor: colors.vendor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    gap: 6,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  completedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  completedTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22C55E',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.delivery,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 8,
    borderRadius: 8,
    gap: 6,
    marginVertical: 10,
  },
  paymentNoteText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  otpHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  otpHint: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  otpInput: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 4,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  completeBtn: {
    backgroundColor: colors.delivery,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  completeBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  goDashboardBtn: {
    backgroundColor: colors.delivery,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goDashboardText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});

