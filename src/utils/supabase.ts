import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvxubzkwqgkgwkqyqwrb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eHViemt3cWdrZ3drcXlxd3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjEzNzAsImV4cCI6MjAyNTM5NzM3MH0.qDTKGVL8xQfQcQs_x8NtJBUYqJRQ5T5GqHqkGHpIKvY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample test user credentials
export const TEST_USER = {
  email: 'admin@test.com',
  password: 'admin123'
};

// Function to create test user if it doesn't exist
export const createTestUser = async () => {
  try {
    // First check if user exists
    const { data: { user: existingUser }, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    if (existingUser) {
      console.log('Test user already exists');
      return existingUser;
    }

    // If user doesn't exist, create new user
    const { data: { user }, error } = await supabase.auth.signUp({
      email: TEST_USER.email,
      password: TEST_USER.password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Error creating test user:', error);
      throw error;
    }

    console.log('Test user created successfully');
    return user;
  } catch (error) {
    console.error('Error in createTestUser:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) throw error;
  return data;
};