
-- Fix overly permissive integrity_flags INSERT policy
DROP POLICY "System create flags" ON public.integrity_flags;

-- Only allow creating flags for the authenticated user's own interactions or via service role
CREATE POLICY "Authenticated create own flags" ON public.integrity_flags 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);
