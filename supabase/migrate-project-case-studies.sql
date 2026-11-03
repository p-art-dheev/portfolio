-- Project case studies: adds the fields behind /projects/[slug] and fills in
-- drafts for the existing projects. Run once in the Supabase SQL editor.
-- Safe to re-run: it only fills fields that are still empty, so edits made in
-- the admin are never overwritten. Review the text in /admin/projects after.

alter table public.projects
  add column if not exists problem text not null default '',
  add column if not exists role text not null default '',
  add column if not exists approach text not null default '',
  add column if not exists outcome text not null default '',
  add column if not exists highlights text[] not null default '{}',
  add column if not exists gallery text[] not null default '{}',
  add column if not exists video_url text;

-- Drafts written from each project's GitHub README and notebook results.
-- Matched by slug; rows with other slugs are left alone.

-- Electricity Load Forecasting
update public.projects set
  github_url = coalesce(nullif(github_url, ''), 'https://github.com/p-art-dheev/PJME-Weekly-Forecast'),
  problem = case when problem = '' then 'Grid operators plan generation weeks ahead, so they need reliable forecasts of weekly demand. I wanted to see how classical statistical models, a regime-switching model and a neural network compare on the same real grid data.' else problem end,
  role = case when role = '' then 'Solo project: data preparation, analysis, modelling and evaluation.' else role end,
  approach = case when approach = '' then 'I aggregated PJM East (PJME) hourly load into weekly totals and split it by time, with about 730 weeks for training and 105 for testing. I checked stationarity with ADF and KPSS tests and ACF/PACF plots, and decomposed the series into trend and seasonality.

Then I fit four models: a baseline SARIMA, an auto_arima-tuned SARIMA, a SETAR(2,1) threshold model and a stacked LSTM. Each was scored on the same held-out weeks with MAE, RMSE and MAPE.' else approach end,
  outcome = case when outcome = '' then 'Weekly demand has a strong 52-week seasonal cycle on top of a clear trend. The seasonal ARIMA baseline reached 14.6% MAPE on the held-out weeks, which set the bar the other models were compared against.' else outcome end,
  highlights = case when cardinality(highlights) = 0 then array['About 730 training weeks and 105 test weeks of PJME load', '4 models compared: 2 SARIMA, SETAR and LSTM', 'Baseline SARIMA: 14.6% MAPE on held-out data'] else highlights end
where slug = 'project-one';

-- Aspect Based Sentiment Analysis
update public.projects set
  github_url = coalesce(nullif(github_url, ''), 'https://github.com/p-art-dheev/absa'),
  problem = case when problem = '' then 'A review like "great battery, dim screen" is neither positive nor negative overall. Aspect-based sentiment analysis predicts the sentiment toward each specific aspect, which is what a product team actually needs.' else problem end,
  role = case when role = '' then 'Solo project: preprocessing, baselines, model experiments and evaluation.' else role end,
  approach = case when approach = '' then 'I used the SemEval ATSA laptop and restaurant review datasets. I first built TF-IDF baselines (Naive Bayes and softmax regression, implemented by hand), then fine-tuned BERT-family encoders with the sentence and the aspect encoded as a pair.

I compared plain BERT, BERT with LSTM and attention heads, RoBERTa and DeBERTa, and ran a QLoRA (4-bit + LoRA) experiment. Because the datasets are small, I used stratified k-fold cross-validation to get stable estimates.' else approach end,
  outcome = case when outcome = '' then 'On the laptop test set, RoBERTa-base was the strongest model, with 81.0% accuracy and 0.78 macro-F1. The classical TF-IDF baselines reached 65 to 70% accuracy.' else outcome end,
  highlights = case when cardinality(highlights) = 0 then array['RoBERTa-base: 81.0% accuracy and 0.78 macro-F1 on the laptop test set', '7 approaches compared, from TF-IDF baselines to QLoRA', 'Stratified k-fold cross-validation on small datasets'] else highlights end
where slug = 'project-two';

-- Codeproctor
update public.projects set
  gallery = case when cardinality(gallery) = 0 then array['/projects/gallery/03/2.png', '/projects/gallery/03/3.png', '/projects/gallery/03/4.png'] else gallery end
where slug = 'project-three';

-- Meal Nutrition Optimizer
update public.projects set
  github_url = coalesce(nullif(github_url, ''), 'https://github.com/p-art-dheev/nutrix'),
  problem = case when problem = '' then 'Planning meals that hit calorie, protein and micronutrient targets at a low cost is a constrained optimisation problem that people usually solve by guesswork.' else problem end,
  role = case when role = '' then 'Built the full stack: the FastAPI backend, the optimisation models and the React + TypeScript frontend.' else role end,
  approach = case when approach = '' then 'Users upload a food dataset. The backend cleans it, dropping empty rows and rows whose macros are physically impossible under the 4-4-9 kcal rule, then shows descriptive statistics, distributions and correlations.

Two models are solved with PuLP and the CBC solver: a linear program for an optimal protein diet, and a mixed-integer program that picks foods to cover nutrient deficiencies. The app deploys as one Vercel project, with the API as a Python function and uploads stored in Vercel Blob.' else approach end,
  outcome = case when outcome = '' then 'An end-to-end app: upload a dataset, explore it, and get a meal plan that meets the nutritional constraints.' else outcome end,
  highlights = case when cardinality(highlights) = 0 then array['LP and MILP models solved with the CBC solver', 'Data validation using the 4-4-9 kcal rule', 'FastAPI and React, deployed together on Vercel'] else highlights end
where slug = 'project-four';
