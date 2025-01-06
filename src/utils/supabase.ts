import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpdgwwhnapzchnvtvjqu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eHViemt3cWdrZ3drcXlxd3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjEzNzAsImV4cCI6MjAyNTM5NzM3MH0.qDTKGVL8xQfQcQs_x8NtJBUYqJRQ5T5GqHqkGHpIKvY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Function to create a test admin user
export const createTestAdminUser = async () => {
  const email = 'admin@admin.com';
  const password = 'admin123';

  try {
    // First, try to sign in with these credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // If sign in succeeds, user already exists
    if (signInData?.user) {
      console.log('Admin user already exists');
      return { email, password };
    }

    // If user doesn't exist, create new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Error creating test admin user:', error);
      throw error;
    }

    console.log('Test admin user created successfully:', data);
    return { email, password };
  } catch (error) {
    console.error('Error in createTestAdminUser:', error);
    throw error;
  }
};

// Initialize test admin user - but don't block the app if it fails
createTestAdminUser().catch(error => {
  console.error('Failed to initialize admin user:', error);
});