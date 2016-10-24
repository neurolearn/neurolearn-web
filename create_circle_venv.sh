# An excerpt from scikit-learn's build-tools
# https://github.com/scikit-learn/scikit-learn/blob/master/build_tools/circle/build_doc.sh

# deactivate circleci virtualenv and setup a miniconda env instead
if [[ `type -t deactivate` ]]; then
  deactivate
fi

pushd .
cd
mkdir -p download
cd download
echo "Cached in $HOME/download :"
ls -l
if [[ ! -f miniconda.sh ]]
then
   wget https://repo.continuum.io/miniconda/Miniconda-latest-Linux-x86_64.sh \
   -O miniconda.sh
fi
chmod +x miniconda.sh && ./miniconda.sh -b -p $HOME/miniconda
cd ..
export PATH="$HOME/miniconda/bin:$PATH"
conda update --yes --quiet conda
popd

# Configure the conda environment and put it in the path using the
# provided versions
conda create -n testenv --yes --quiet python
source activate testenv

pip install -r requirements/dev.txt
