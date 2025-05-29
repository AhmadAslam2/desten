import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../store/useAuth';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CUSTOMER_LOGIN, CUSTOMER_CREATE, GET_CUSTOMER } from '../api/mutations';
import { fs, moderateScale, verticalScale } from '../utils/responsive';
import { Typography } from '../components/typography/Typography';
import { HelpIcon } from '../assets/icons';

type LoginScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Profile'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const { login, signup, loading, error } = useAuth();
  const [loginMutation] = useMutation(CUSTOMER_LOGIN);
  const [signupMutation] = useMutation(CUSTOMER_CREATE);
  const [getCustomerQuery] = useLazyQuery(GET_CUSTOMER);

  const handleSubmit = async () => {
    try {
      if (isLoginMode) {
        await login(formData.email, formData.password, loginMutation, getCustomerQuery);
        // No need to navigate since we're already in the tab navigator
      } else {
        await signup(formData, signupMutation);
        // After successful signup, log the user in
        await login(formData.email, formData.password, loginMutation, getCustomerQuery);
        // No need to navigate since we're already in the tab navigator
      }
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBg}>
          <Typography variant="h1" style={styles.title}>
            Welcome to Example Store
          </Typography>
          <Typography variant="p" style={styles.subtitle}>
            Experience the convenience of online shopping. Browse our wide selection of products,
            from digital goods to physical items – all available instantly, anytime, anywhere.
            No more store visits needed!
          </Typography>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Typography variant="p" style={styles.error}>
                  {error}
                </Typography>
              </View>
            )}

            {!isLoginMode && (
              <View style={styles.nameFieldsContainer}>
                <View style={styles.nameField}>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={text => setFormData({ ...formData, firstName: text })}
                    autoCapitalize="words"
                    editable={!loading}
                    placeholderTextColor={colors.grey[300]}
                  />
                </View>
                <View style={styles.nameField}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={text => setFormData({ ...formData, lastName: text })}
                    autoCapitalize="words"
                    editable={!loading}
                    placeholderTextColor={colors.grey[300]}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                placeholderTextColor={colors.grey[300]}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={text => setFormData({ ...formData, password: text })}
                secureTextEntry
                editable={!loading}
                placeholderTextColor={colors.grey[300]}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.ui.background} />
              ) : (
                <Typography variant="button" style={styles.buttonText}>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </Typography>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleLink} onPress={toggleMode} disabled={loading}>
              <Typography variant="p" style={styles.toggleText}>
                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                <Typography variant="button" style={styles.toggleTextBold}>
                  {isLoginMode ? 'Create Account' : 'Login'}
                </Typography>
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
        {/* <TouchableOpacity
          style={[styles.cardSection, styles.lowerCardVerticalMargin]}
          onPress={() => navigation.navigate('FaqModal')}
        >
          <View style={styles.cardRow}>
            <HelpIcon />
            <View>
              <Typography variant="h5" style={styles.cardTitle}>
                Help
              </Typography>
              <Typography variant="p" style={styles.cardDesc}>
                Report a problem here.
              </Typography>
            </View>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.primary[0],
  },
  headerBg: {
    backgroundColor: colors.primary[100],
    paddingTop: verticalScale(40),
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(24),
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
  },
  title: {
    color: colors.primary[500],
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
  },
  subtitle: {
    color: colors.black[100],
    fontSize: fs(16),
    lineHeight: fs(24),
    maxWidth: '90%',
  },
  formContainer: {
    backgroundColor: colors.ui.background,
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(16),
    marginTop: verticalScale(24),
    padding: moderateScale(16),
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: colors.semantic.error + '10',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  error: {
    color: colors.semantic.error,
    textAlign: 'center',
  },
  nameFieldsContainer: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  nameField: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: verticalScale(16),
  },
  input: {
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    fontSize: fs(16),
    backgroundColor: colors.primary[0],
    color: colors.ui.text.primary,
  },
  button: {
    backgroundColor: colors.black[100],
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.ui.background,
    fontSize: fs(16),
  },
  toggleLink: {
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  toggleText: {
    color: colors.black[100],
  },
  toggleTextBold: {
    color: colors.primary[500],
  },
  cardSection: {
    backgroundColor: colors.primary[100],
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginVertical: moderateScale(24),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardTitle: {
    fontWeight: '700',
    color: colors.black[100],
  },
  cardDesc: {
    color: colors.black[100],
    maxWidth: 270,
  },
  lowerCardVerticalMargin: {
    marginTop: moderateScale(8),
    marginBottom: 0,
  },
});
