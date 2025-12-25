#!/usr/bin/env python3
"""
Merge Google Scholar data into existing records.
"""

import json
import pandas as pd

# Google Scholar data (extracted from user-provided page)
google_scholar_data = [
    {"name": "Stephen M. Smith", "institution": "WIN (FMRIB), Oxford University", "cited_by_count": 263905, "fields": "Brain imaging MRI Computational Neuroscience Connectomics Medical Image Analysis"},
    {"name": "Anders M. Dale", "institution": "President, J Craig Venter Institute", "cited_by_count": 224519, "fields": "Neuroimaging MRI Computational Neuroscience Statistical Genetics Biomedical Optics"},
    {"name": "Terrence Sejnowski", "institution": "Francis Crick Professor, Salk Institute", "cited_by_count": 187381, "fields": "Computational Neuroscience Artificial Intelligence"},
    {"name": "Jonathon Shlens", "institution": "Principal Scientist and Director, Google Research", "cited_by_count": 175314, "fields": "Vision Machine Learning Computational Neuroscience"},
    {"name": "Klaus-Robert Müller", "institution": "TU Berlin & Korea University & Google DeepMind", "cited_by_count": 172217, "fields": "Machine learning artificial intelligence big data computational neuroscience"},
    {"name": "Joshua B. Tenenbaum", "institution": "MIT", "cited_by_count": 139379, "fields": "Cognitive science artificial intelligence machine learning computational neuroscience"},
    {"name": "Eero P Simoncelli", "institution": "Professor of Neural Science, Mathematics, NYU", "cited_by_count": 132788, "fields": "Computational Vision Computational Neuroscience Image Processing"},
    {"name": "Tim Behrens", "institution": "Professor of Computational Neuroscience, University of Oxford", "cited_by_count": 128893, "fields": "Computational Neuroscience Behavioral Neuroscience Representation learning"},
    {"name": "Edmund T Rolls", "institution": "Oxford Centre for Computational Neuroscience", "cited_by_count": 126138, "fields": "Neuroscience Computational Neuroscience Emotion Memory Vision"},
    {"name": "Olaf Sporns", "institution": "Distinguished Professor, Indiana University", "cited_by_count": 125492, "fields": "Network Neuroscience Connectomics"},
    {"name": "Vinod Menon", "institution": "Professor of Psychiatry, Neurology, Stanford University", "cited_by_count": 106291, "fields": "Systems neuroscience Psychiatry Cognitive neuroscience Computational neuroscience"},
    {"name": "Christos H Papadimitriou", "institution": "Columbia University", "cited_by_count": 102049, "fields": "Algorithms Complexity Game Theory Evolution Computational Neuroscience"},
    {"name": "Matthew Botvinick", "institution": "Google DeepMind, Yale Law School, UCL", "cited_by_count": 101163, "fields": "Artificial Intelligence AI Policy Cognitive Science Computational Neuroscience"},
    {"name": "Stephen Grossberg", "institution": "Wang Professor, Boston University", "cited_by_count": 89143, "fields": "computational neuroscience theoretical cognitive science neuromorphic technology"},
    {"name": "Mark Woolrich", "institution": "Director, OHBA, University of Oxford", "cited_by_count": 88364, "fields": "Neuroscience Neuroimaging Computational Neuroscience Machine Learning"},
    {"name": "Jean-Jacques Slotine", "institution": "MIT, Professor of Mechanical Engineering", "cited_by_count": 82313, "fields": "Dynamical Systems Control Theory Complex Systems Computational Neuroscience"},
    {"name": "Aapo Hyvärinen", "institution": "University of Helsinki", "cited_by_count": 79312, "fields": "Machine Learning Computational Neuroscience"},
    {"name": "Daniel Wolpert", "institution": "Professor of Neuroscience, Columbia University", "cited_by_count": 79215, "fields": "Neuroscience Computational Neuroscience motor control motor learning"},
    {"name": "H Sebastian Seung", "institution": "Professor, Princeton Neuroscience Institute", "cited_by_count": 69823, "fields": "computational neuroscience connectomics"},
    {"name": "Peter J. Basser", "institution": "Senior Investigator, NICHD, NIH", "cited_by_count": 63311, "fields": "Diffusion MRI Neuroscience"},
    {"name": "Dana Ballard", "institution": "Professor of Computer Science, UT Austin", "cited_by_count": 63090, "fields": "Neuroscience Computational neuroscience motor control"},
    {"name": "Laurent Itti", "institution": "Professor of Computer Science, USC", "cited_by_count": 62839, "fields": "Computational neuroscience machine vision artificial intelligence"},
    {"name": "Michael Arbib", "institution": "University of California at San Diego", "cited_by_count": 57355, "fields": "Computational Neuroscience Neurolinguistics Neuroinformatics"},
    {"name": "David J Heeger", "institution": "Professor of Psychology and Neural Science, NYU", "cited_by_count": 55780, "fields": "Neuroscience Visual Neuroscience Computational Neuroscience"},
    {"name": "Stefan Schaal", "institution": "Google, Robotics, Machine Learning", "cited_by_count": 55686, "fields": "artificial intelligence robotics computational neuroscience"},
    {"name": "Matthias Bethge", "institution": "Tübingen University & Maddox", "cited_by_count": 52986, "fields": "Computational Neuroscience Machine Learning Vision"},
    {"name": "Xiao-Jing Wang", "institution": "Global Professor of Neural Science, NYU", "cited_by_count": 51600, "fields": "Computational Neuroscience Large-scale Modeling Working Memory"},
    {"name": "Daniel D. Lee", "institution": "Tisch University Professor, Cornell University", "cited_by_count": 50836, "fields": "machine learning robotics computational neuroscience"},
    {"name": "Read Montague", "institution": "Professor of Physics, Virginia Tech", "cited_by_count": 49893, "fields": "Neuroscience computational neuroscience social neuroscience"},
    {"name": "Blaise Aguera y Arcas", "institution": "VP Engineering Fellow, Google Research", "cited_by_count": 47525, "fields": "AI Machine Learning Computer Vision Computational Neuroscience"},
    {"name": "Michael J Frank", "institution": "Professor, Brown University", "cited_by_count": 47481, "fields": "Computational Psychiatry Dopamine Decision Neuroscience"},
    {"name": "Gustavo Deco", "institution": "University Pompeu Fabra, ICREA", "cited_by_count": 46121, "fields": "Computational Neuroscience"},
    {"name": "Horace Barlow", "institution": "Cambridge University (1921-2020)", "cited_by_count": 44798, "fields": "Neuroscience Computational Neuroscience Systems Neuroscience Vision"},
    {"name": "Bard Ermentrout", "institution": "Professor of Mathematics, Univ of Pittsburgh", "cited_by_count": 41594, "fields": "Mathematical Biology computational neuroscience"},
    {"name": "Michael Hasselmo", "institution": "Director, Center for Systems Neuroscience, Boston University", "cited_by_count": 41510, "fields": "Systems Neuroscience Episodic Memory Computational Neuroscience"},
    {"name": "Kenneth Harris", "institution": "University College London", "cited_by_count": 41416, "fields": "Neuroscience Mathematical Neuroscience Computational Neuroscience"},
    {"name": "Eve Marder", "institution": "Brandeis University", "cited_by_count": 40610, "fields": "neuromodulation computational neuroscience dynamics of small networks"},
    {"name": "Malvin Carl Teich", "institution": "Professor Emeritus, Columbia & Boston U", "cited_by_count": 39445, "fields": "Quantum photonics Fractal stochastic processes Computational neuroscience"},
    {"name": "Reza Shadmehr", "institution": "Professor, Johns Hopkins School of Medicine", "cited_by_count": 39194, "fields": "Cerebellum Motor control Computational neuroscience"},
    {"name": "Matteo Carandini", "institution": "Professor of Visual Neuroscience, UCL", "cited_by_count": 37977, "fields": "Neuroscience Visual Neuroscience Computational Neuroscience"},
    {"name": "Michael Breakspear", "institution": "University of Newcastle, Australia", "cited_by_count": 37881, "fields": "Computational neuroscience Computational psychiatry"},
    {"name": "Wolfgang Maass", "institution": "Professor of Computer Science, Graz University", "cited_by_count": 35706, "fields": "Computational Neuroscience Machine Learning Computational Complexity"},
    {"name": "M. Di Ventra", "institution": "Professor of Physics, UC San Diego", "cited_by_count": 34575, "fields": "Physics Condensed Matter Unconventional Computing Computational Neuroscience"},
    {"name": "Krzysztof J. Gorgolewski", "institution": "Anthropic", "cited_by_count": 34417, "fields": "large language models artificial intelligence computational neuroscience"},
    {"name": "Auke Ijspeert", "institution": "EPFL, Switzerland", "cited_by_count": 33441, "fields": "biorobotics robotics computational neuroscience motor control"},
    {"name": "Bruno Olshausen", "institution": "Professor, UC Berkeley", "cited_by_count": 32883, "fields": "Computational neuroscience vision natural scenes sparse coding"},
    {"name": "Yanping Huang", "institution": "Google Brain", "cited_by_count": 32515, "fields": "Artificial Intelligence Deep Learning Computational Neuroscience"},
    {"name": "Eugene Izhikevich", "institution": "Chairman, Brain Corp", "cited_by_count": 32425, "fields": "computational neuroscience dynamical systems"},
    {"name": "Alain Destexhe", "institution": "CNRS", "cited_by_count": 32408, "fields": "Neuroscience computational neuroscience theoretical neuroscience"},
    {"name": "Barry Horwitz", "institution": "Brain Imaging & Modeling Section, NIH", "cited_by_count": 31890, "fields": "neuroscience computational neuroscience functional neuroimaging"},
    {"name": "Federico Turkheimer", "institution": "Professor of Neuroimaging, King's College London", "cited_by_count": 31133, "fields": "Neuroscience neuroimaging computational neuroscience"},
    {"name": "Michael N. Smolka", "institution": "Professor, TU Dresden", "cited_by_count": 31068, "fields": "addiction cognitive neuroscience computational neuroscience"},
    {"name": "Samuel Gershman", "institution": "Professor, Harvard University", "cited_by_count": 30946, "fields": "Computational neuroscience cognitive science machine learning"},
    {"name": "Ehsan Adeli", "institution": "Stanford University", "cited_by_count": 30676, "fields": "Computer Vision Computational Neuroscience Precision Healthcare"},
    {"name": "David Touretzky", "institution": "Professor of Computer Science, Carnegie Mellon", "cited_by_count": 30510, "fields": "artificial intelligence robotics computational neuroscience"},
    {"name": "Chiyuan Zhang", "institution": "Google Research", "cited_by_count": 30131, "fields": "Machine Learning Computational Neuroscience"},
    {"name": "David J. Field", "institution": "Professor of Psychology, Cornell University", "cited_by_count": 29996, "fields": "vision computational vision natural scenes computational neuroscience"},
    {"name": "Carson C Chow", "institution": "Senior Investigator, NIDDK, NIH", "cited_by_count": 29700, "fields": "Mathematical Biology Computational Neuroscience Dynamical Systems"},
    {"name": "Alexandre Pouget", "institution": "University of Geneva", "cited_by_count": 29453, "fields": "computational neuroscience"},
    {"name": "Kenji Doya", "institution": "Okinawa Institute of Science and Technology", "cited_by_count": 29378, "fields": "Computational Neuroscience Neural Networks Reinforcement Learning"},
    {"name": "Rajesh P. N. Rao", "institution": "Computer Science, University of Washington", "cited_by_count": 28533, "fields": "Computational Neuroscience Brain-Computer Interfacing AI"},
    {"name": "Ad Aertsen", "institution": "Professor, University of Freiburg", "cited_by_count": 28387, "fields": "Computational Neuroscience Systems Neuroscience Neurotechnology"},
    {"name": "Kenneth A. Norman", "institution": "Professor of Psychology, Princeton University", "cited_by_count": 27895, "fields": "Cognitive Neuroscience Computational Neuroscience Cognitive Psychology"},
    {"name": "Simon J. Thorpe", "institution": "Emeritus CNRS Research Director", "cited_by_count": 27664, "fields": "Computational Neuroscience Perception Memory Neural Networks AI"},
    {"name": "Xiaolin Hu", "institution": "Associate Professor, Tsinghua University", "cited_by_count": 27060, "fields": "artificial neural networks computational neuroscience"},
    {"name": "Cameron C. McIntyre", "institution": "Duke University", "cited_by_count": 26996, "fields": "Neuromodulation Deep Brain Stimulation Neural Engineering"},
    {"name": "Ernst Niebur", "institution": "Johns Hopkins University", "cited_by_count": 26819, "fields": "computational neuroscience"},
    {"name": "John Rinzel", "institution": "Professor of Neural Science and Mathematics, NYU", "cited_by_count": 26315, "fields": "Computational Neuroscience Sensory Processing"},
    {"name": "Yael Niv", "institution": "Professor of Psychology, Princeton University", "cited_by_count": 26058, "fields": "reinforcement learning neuroeconomics computational neuroscience"},
    {"name": "John K. Tsotsos", "institution": "York University, Canada", "cited_by_count": 25881, "fields": "vision attention computer vision robotics computational neuroscience"},
    {"name": "Ildefons Magrans de Abril", "institution": "Postdoc at Universitat Pompeu Fabra", "cited_by_count": 25664, "fields": "Machine learning computational neuroscience"},
    {"name": "Rodney Douglas", "institution": "Professor of Computational Neuroscience, ETH", "cited_by_count": 24837, "fields": "Neuroscience Neuromorphic Engineering Neuroinformatics"},
    {"name": "Christopher J. Honey", "institution": "Associate Professor, Johns Hopkins University", "cited_by_count": 24659, "fields": "Cognitive Neuroscience Computational Neuroscience Systems Neuroscience"},
    {"name": "Cameron Craddock", "institution": "The Neuro Bureau, Meta", "cited_by_count": 24565, "fields": "Medical Imaging Neuroinformatics MRI Computational Neuroscience"},
    {"name": "Gabriel Kreiman", "institution": "Professor, Harvard Medical School", "cited_by_count": 24517, "fields": "Artificial Intelligence Computational Biology Computational Neuroscience"},
    {"name": "Mark Reimers", "institution": "Michigan State U", "cited_by_count": 24268, "fields": "computational neuroscience genomics"},
    {"name": "Alexander S. Ecker", "institution": "University of Göttingen", "cited_by_count": 23834, "fields": "Computational Neuroscience Vision Machine Learning"},
    {"name": "Christian Igel", "institution": "University of Copenhagen", "cited_by_count": 23804, "fields": "machine learning computational intelligence computational neuroscience"},
    {"name": "Stefano Panzeri", "institution": "University Medical Center Hamburg-Eppendorf", "cited_by_count": 23653, "fields": "Computational Neuroscience Neural Coding Systems Neuroscience"},
    {"name": "Andreas Tolias", "institution": "Stanford University", "cited_by_count": 23345, "fields": "systems neuroscience computational neuroscience machine learning NeuroAI"},
    {"name": "Ying Nian Wu", "institution": "UCLA Department of Statistics", "cited_by_count": 23066, "fields": "Generative AI Representation learning Computer vision Computational neuroscience"},
    {"name": "Bernhard Nessler", "institution": "SCCH GmbH & JKU Linz", "cited_by_count": 22371, "fields": "Computational Neuroscience Machine Learning Deep Learning"},
    {"name": "Dora E Angelaki", "institution": "Professor, NYU", "cited_by_count": 22333, "fields": "computational neuroscience multisensory vision spatial navigation"},
    {"name": "Jean Daunizeau", "institution": "INSERM / Paris Brain Institute", "cited_by_count": 22281, "fields": "Computational neuroscience"},
    {"name": "Claudia Clopath", "institution": "Bioengineering, Imperial College London", "cited_by_count": 22139, "fields": "Computational Neuroscience"},
    {"name": "Daniel Yamins", "institution": "Associate Professor, Stanford University", "cited_by_count": 22058, "fields": "Computational Neuroscience AI Computational Cognitive Science"},
    {"name": "Thomas Serre", "institution": "Professor, Brown University", "cited_by_count": 21999, "fields": "computational neuroscience computer vision deep learning"},
    {"name": "Dipanjan Roy", "institution": "IIT Jodhpur", "cited_by_count": 21845, "fields": "Cognitive Neuroscience Computational Neuroscience Machine learning"},
    {"name": "Neil Rabinowitz", "institution": "DeepMind", "cited_by_count": 21543, "fields": "deep learning computational neuroscience"},
    {"name": "Ferdinando Mussa-Ivaldi", "institution": "Professor, Northwestern University", "cited_by_count": 21464, "fields": "Systems Neuroscience Motor Learning Robotics Computational Neuroscience"},
    {"name": "Evelina Fedorenko", "institution": "MIT, Associate Professor", "cited_by_count": 21339, "fields": "Cognitive Neuroscience Computational Neuroscience Neurolinguistics"},
    {"name": "Zachary F Mainen", "institution": "Champalimaud Neuroscience Programme", "cited_by_count": 21260, "fields": "Neuroscience Systems neuroscience Computational Neuroscience"},
    {"name": "Adam Santoro", "institution": "Google DeepMind", "cited_by_count": 21056, "fields": "Computational Neuroscience Machine Learning Memory Consolidation"},
    {"name": "Claus C. Hilgetag", "institution": "Professor, University Medical Center Hamburg", "cited_by_count": 20971, "fields": "Neuroinformatics Computational Neuroscience"},
    {"name": "Peter Jung", "institution": "Professor of Physics, Ohio University", "cited_by_count": 20510, "fields": "Biophysics Computational Neuroscience Computational Cell Biology"},
    {"name": "Misha Tsodyks", "institution": "Weizmann Institute", "cited_by_count": 20330, "fields": "Computational neuroscience nonlinear dynamics statistical physics"},
    {"name": "Hamid Reza Marateb", "institution": "University of Isfahan", "cited_by_count": 20274, "fields": "Medical Data Mining Digital Health Computational Neuroscience"},
    {"name": "Tamar Flash", "institution": "Weizmann Institute", "cited_by_count": 19961, "fields": "Neuroscience motor control robotics computational neuroscience"},
    {"name": "James M Bower", "institution": "Affiliate Professor, Southern Oregon University", "cited_by_count": 19809, "fields": "computational neuroscience neurophysiology science education"},
    {"name": "Wilson S Geisler", "institution": "Professor, University of Texas at Austin", "cited_by_count": 19781, "fields": "vision science visual neuroscience computational neuroscience"},
]

def normalize_name(name):
    """Normalize name for comparison."""
    # Remove extra spaces, normalize case
    name = ' '.join(name.split())
    # Handle common variants
    replacements = {
        "Terrence J. Sejnowski": "Terrence Sejnowski",
        "Terrence J Sejnowski": "Terrence Sejnowski",
        "Joshua B Tenenbaum": "Joshua B. Tenenbaum",
        "Daniel M Wolpert": "Daniel Wolpert",
        "Daniel M. Wolpert": "Daniel Wolpert",
        "Michael J. Frank": "Michael J Frank",
        "Gustavo Deco": "GUSTAVO DECO",
        "Eugene M. Izhikevich": "Eugene Izhikevich",
        "Samuel J. Gershman": "Samuel Gershman",
        "Samuel J Gershman": "Samuel Gershman",
        "Claudia Clopath": "Prof. Claudia Clopath",
    }
    for old, new in replacements.items():
        if name == old or name == new:
            return old  # Return first as standard form
    return name

def main():
    # Load existing data
    existing_df = pd.read_csv("../data/comp_neuro_scholars_raw.csv")
    print(f"Existing records: {len(existing_df)} scholars")

    # Create name mapping (for duplicate detection)
    existing_names = set()
    for name in existing_df['name']:
        existing_names.add(normalize_name(name))

    # Process Google Scholar data
    new_scholars = []
    updated_count = 0

    for gs in google_scholar_data:
        gs_name = gs['name']
        normalized = normalize_name(gs_name)

        # Check if already exists
        found = False
        for idx, row in existing_df.iterrows():
            if normalize_name(row['name']) == normalized or \
               gs_name.lower() in row['name'].lower() or \
               row['name'].lower() in gs_name.lower():
                # Update existing record
                existing_df.at[idx, 'cited_by_count'] = gs['cited_by_count']
                existing_df.at[idx, 'institution'] = gs['institution'].split(',')[0] if gs['institution'] else row['institution']
                updated_count += 1
                found = True
                print(f"Updated: {gs_name} -> {gs['cited_by_count']:,} citations")
                break

        if not found:
            # New scholar
            new_scholars.append({
                'id': f"https://openalex.org/GS_{gs_name.replace(' ', '_')}",
                'name': gs_name,
                'orcid': '',
                'works_count': 0,
                'cited_by_count': gs['cited_by_count'],
                'h_index': 0,  # Not directly shown on Google Scholar page
                'i10_index': 0,
                '2yr_mean_citedness': 0,
                'institution': gs['institution'].split(',')[0] if gs['institution'] else '',
                'country': '',
                'top_concepts': gs['fields'],
                'works_api_url': '',
            })
            print(f"Added: {gs_name} ({gs['cited_by_count']:,} citations)")

    print(f"\nUpdated {updated_count} existing records")
    print(f"Added {len(new_scholars)} new scholars")

    # Merge data
    if new_scholars:
        new_df = pd.DataFrame(new_scholars)
        combined_df = pd.concat([existing_df, new_df], ignore_index=True)
    else:
        combined_df = existing_df

    # Sort by citations
    combined_df = combined_df.sort_values('cited_by_count', ascending=False)

    # Save
    combined_df.to_csv("../data/comp_neuro_scholars_raw.csv", index=False, encoding='utf-8')
    print(f"\nTotal {len(combined_df)} scholars saved to ../data/comp_neuro_scholars_raw.csv")

    # Display top 20
    print("\n=== TOP 20 Scholars (by citations) ===")
    for i, (_, row) in enumerate(combined_df.head(20).iterrows(), 1):
        print(f"{i:2d}. {row['name']}: {row['cited_by_count']:,} citations")

if __name__ == "__main__":
    main()
