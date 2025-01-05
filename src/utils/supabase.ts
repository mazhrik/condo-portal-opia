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
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select()
    .eq('email', TEST_USER.email)
    .single();

  if (!existingUser && !fetchError) {
    const { data, error } = await supabase.auth.signUp({
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
    
    return data;
  }
  
  return existingUser;
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) throw error;
  return data;
};