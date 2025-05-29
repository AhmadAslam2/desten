import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Typography } from '../components/typography/Typography';
import { colors } from '../theme/colors';
import { fs, moderateScale, verticalScale } from '../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useCustomerDetails } from '../hooks/useCustomerDetails';

export const AccountDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { customer, loading, error } = useCustomerDetails();
  const name = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim();

  const EmptyStateMessage = ({ message }: { message: string }) => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="information-circle-outline" size={24} color={colors.grey[300]} />
      <Typography variant="p" style={styles.emptyStateText}>
        {message}
      </Typography>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBg}>
        <Typography variant="h1" style={styles.headerTitle}>
          Account Details
        </Typography>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {loading ? (
          <View style={styles.centerContainer}>
            <Typography variant="p">Loading...</Typography>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Typography variant="p" style={{ color: colors.semantic.error }}>
              Error loading details.
            </Typography>
          </View>
        ) : (
          customer && (
            <>
              {/* Account Info */}
              <View style={styles.cardSection}>
                <View style={styles.avatarCircle}>
                  <Typography variant="h1" style={styles.avatarText}>
                    {customer?.firstName?.[0] || ''}
                    {customer?.lastName?.[0] || ''}
                  </Typography>
                </View>
                <Typography variant="h3" style={styles.name}>
                  {name}
                </Typography>
                <Typography variant="p" style={styles.email}>
                  {customer?.email}
                </Typography>
                {customer?.phone && (
                  <Typography variant="p" style={styles.phone}>
                    {customer.phone}
                  </Typography>
                )}
                <Typography variant="p" style={styles.settingLabel}>
                  Accepts Marketing: {customer.acceptsMarketing ? 'Yes' : 'No'}
                </Typography>
              </View>

              {/* Addresses */}
              <Typography variant="h3" style={styles.sectionTitle}>
                Addresses
              </Typography>
              {customer.addresses?.edges.length === 0 ? (
                <EmptyStateMessage message="No addresses found" />
              ) : (
                customer.addresses?.edges.map(({ node }: any) => (
                  <View key={node.id} style={styles.sectionBox}>
                    <Typography variant="p" style={styles.addressText}>
                      {node.address1} {node.address2}
                    </Typography>
                    <Typography variant="p" style={styles.addressText}>
                      {node.city}, {node.country} {node.zip}
                    </Typography>
                    {node.phone && (
                      <Typography variant="p" style={styles.addressText}>
                        Phone: {node.phone}
                      </Typography>
                    )}
                  </View>
                ))
              )}

              {/* Order History */}
              <Typography variant="h3" style={styles.sectionTitle}>
                Order History
              </Typography>
              {customer.orders?.edges.length === 0 ? (
                <EmptyStateMessage message="Start shopping to see your order history here." />
              ) : (
                customer.orders?.edges.map(({ node }: any) => (
                  <View key={node.id} style={styles.sectionBox}>
                    <Typography variant="p" style={styles.orderText}>
                      Order: {node.name}
                    </Typography>
                    <Typography variant="p" style={styles.orderText}>
                      Date: {new Date(node.processedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="p" style={styles.orderText}>
                      Total: {node.totalPriceV2.amount} {node.totalPriceV2.currencyCode}
                    </Typography>
                    <Typography variant="p" style={styles.orderText}>
                      Status: {node.fulfillmentStatus} / {node.financialStatus}
                    </Typography>
                  </View>
                ))
              )}
            </>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[0],
  },
  headerBg: {
    marginTop: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: moderateScale(8),
    padding: moderateScale(4),
  },
  headerTitle: {
    color: colors.primary[500],
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
    marginLeft: moderateScale(8),
  },
  cardSection: {
    backgroundColor: colors.ui.background,
    borderRadius: moderateScale(16),
    margin: moderateScale(16),
    marginBottom: 0,
    padding: moderateScale(24),
    alignItems: 'center',
    marginTop: moderateScale(32),
  },
  avatarCircle: {
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: verticalScale(40),
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(16),
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
    fontSize: fs(32),
  },
  name: {
    color: colors.black[100],
    fontWeight: '700',
    marginBottom: moderateScale(4),
    marginTop: moderateScale(4),
  },
  email: {
    color: colors.black[100],
    marginBottom: moderateScale(2),
  },
  phone: {
    color: colors.black[100],
    marginTop: moderateScale(2),
  },
  sectionBox: {
    backgroundColor: colors.ui.background,
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    padding: moderateScale(16),
  },
  sectionTitle: {
    color: colors.black[100],
    marginTop: moderateScale(16),
    fontWeight: '700',
    marginLeft: moderateScale(16),
  },
  addressText: {
    color: colors.black[100],
  },
  orderText: {
    color: colors.black[100],
  },
  settingLabel: {
    marginTop: moderateScale(8),
    color: colors.primary[500],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(32),
  },
  emptyStateContainer: {
    backgroundColor: colors.primary[0],
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    padding: moderateScale(24),
    alignItems: 'center',
    gap: moderateScale(8),
  },
  emptyStateText: {
    color: colors.grey[300],
    textAlign: 'center',
    fontSize: fs(14),
  },
});

export default AccountDetailsScreen;
