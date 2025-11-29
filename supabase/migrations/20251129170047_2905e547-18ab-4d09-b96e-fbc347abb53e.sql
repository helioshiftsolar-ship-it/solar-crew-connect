-- Add wallet balance to engineer profiles
ALTER TABLE public.engineer_profiles
ADD COLUMN wallet_balance integer NOT NULL DEFAULT 0,
ADD COLUMN referral_code text UNIQUE,
ADD COLUMN referred_by text;

-- Create index on referral_code for faster lookups
CREATE INDEX idx_engineer_profiles_referral_code ON public.engineer_profiles(referral_code);

-- Create transactions table to track coin movements
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id text NOT NULL REFERENCES public.engineer_profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type text NOT NULL, -- 'referral_bonus', 'subscription_renewal', 'admin_award', 'referral_earned'
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on wallet_transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create referrals table to track successful referrals
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_profile_id text NOT NULL REFERENCES public.engineer_profiles(id) ON DELETE CASCADE,
  referred_profile_id text NOT NULL REFERENCES public.engineer_profiles(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  coins_awarded integer NOT NULL DEFAULT 100,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'expired'
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  UNIQUE(referrer_profile_id, referred_profile_id)
);

-- Enable RLS on referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.engineer_profiles WHERE referral_code = code) INTO exists;
    
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- Create function to handle referral signup
CREATE OR REPLACE FUNCTION public.process_referral(new_profile_id text, referral_code_used text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id text;
  coins_to_award integer := 100;
BEGIN
  -- Find the referrer
  SELECT id INTO referrer_id
  FROM public.engineer_profiles
  WHERE referral_code = referral_code_used;
  
  IF referrer_id IS NOT NULL AND referrer_id != new_profile_id THEN
    -- Update referred_by field
    UPDATE public.engineer_profiles
    SET referred_by = referral_code_used
    WHERE id = new_profile_id;
    
    -- Create referral record
    INSERT INTO public.referrals (referrer_profile_id, referred_profile_id, referral_code, coins_awarded, status, completed_at)
    VALUES (referrer_id, new_profile_id, referral_code_used, coins_to_award, 'completed', now());
    
    -- Award coins to referrer
    UPDATE public.engineer_profiles
    SET wallet_balance = wallet_balance + coins_to_award
    WHERE id = referrer_id;
    
    -- Record transaction
    INSERT INTO public.wallet_transactions (profile_id, amount, transaction_type, description)
    VALUES (referrer_id, coins_to_award, 'referral_earned', 'Earned from referring profile: ' || new_profile_id);
  END IF;
END;
$$;

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view their own transactions"
ON public.wallet_transactions
FOR SELECT
USING (true); -- Public can read for now, but ideally should be restricted to profile owner

CREATE POLICY "System can insert transactions"
ON public.wallet_transactions
FOR INSERT
WITH CHECK (true);

-- RLS Policies for referrals
CREATE POLICY "Users can view referrals"
ON public.referrals
FOR SELECT
USING (true);

CREATE POLICY "System can manage referrals"
ON public.referrals
FOR ALL
USING (true);

-- Update trigger for engineer_profiles to generate referral code
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_referral_code_trigger
BEFORE INSERT ON public.engineer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_referral_code();